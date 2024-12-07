const Listing=require("../models/listing");
// Geocoding
//const L = require('leaflet');
const axios = require('axios'); 
//
const {listingSchema}=require("../schema.js"); 


module.exports.index=async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{ allListings});
}

module.exports.renderNewForm=(req,res)=>{
   // console.log(req.user);
    res.render("listings/new.ejs");
}

module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id)
    .populate({
        path:"reviews",
        populate:{
            path:"author",
        },
    }) 
    .populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    //console.log(listing);
    res.render("listings/show.ejs",{listing});
}

module.exports.createListing = async (req, res, next) => {
    const address = req.body.listing.location; // Assume address is part of the listing form data
    console.log('Address:', address); // Debugging log
    //console.log(req.file);
    
    // Geocoding with Nominatim
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&addressdetails=1`;
    let lat, lon;

    try {
        const response = await axios.get(url);
        const data = response.data;

        if (data.length > 0) {
            lat = data[0].lat;
            lon = data[0].lon;
            console.log('Latitude:', lat); // Debugging log
            console.log('Longitude:', lon); // Debugging log
        } else {
            req.flash('error', 'Location not found!');
            return res.redirect('/listings/new');
        }
    } catch (error) {
        console.error('Geocoding error:', error);
        req.flash('error', 'Error performing geocoding.');
        return res.redirect('/listings/new');
    }

    if (!lat || !lon) {
        req.flash('error', 'Invalid geocoding response.');
        return res.redirect('/listings/new');
    }

    // Ensure file upload is handled
    if (!req.file) {
        req.flash('error', 'Image file is required!');
        return res.redirect('/listings/new');
    }

    // Create the listing with geocoded coordinates in geometry.coordinates
    const url2 = req.file.path;
    const filename = req.file.filename;

    //console.log(url2+" "+filename); 

    const newListing = new Listing({
        ...req.body.listing,
        owner: req.user._id,
        image: { url: url2, filename: filename }, 
        geometry: {
            type: 'Point',
            coordinates: [lon, lat] // Save coordinates in the correct field
        }
    });

    await newListing.save();
    req.flash("success", "New Listing created!");
    res.redirect("/listings");
};


module.exports.renderEditForm=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/h_300,w_250");
    res.render("listings/Edit.ejs",{listing,originalImageUrl});
}

module.exports.updateListing=async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file!=="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }
    
    
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    let deletedLisiting=await Listing.findByIdAndDelete(id);
    console.log(deletedLisiting);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
}