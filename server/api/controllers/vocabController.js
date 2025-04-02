const mongoose = require('mongoose'),
    crypto = require('crypto'),
    Link = mongoose.model('link');

// Get all links disabled 

/*
exports.getAllLinks = (req, res) => {
    Link.find({}, function(err, link) {
        if (err) {
            return res.send(err);
        }
        res.json(link);
    });
};
*/


// Get link by URL
exports.getLinkByUrl = async (req, res) => {
    const url = req.query.link;
   if (!url) {
        return res.status(400).json({ message: "URL query parameter is required" });
    }
    try {
        const link = await Link.findOne({ original_link: url });
        if (!link) {
            return res.status(404).json({ message: "Link not found" });
        }
        res.json(link);
    } catch (err) {
        return res.status(500).json({
            error: 'Error processing link',
            details: err.message
        });
    }
};

// Create a new link
exports.createLink = (req, res) => {
    // Validate original_link is provided
    if (!req.body.original_link) {
        return res.status(400).json({
            error: 'Missing required field',
            missingField: 'original_link'
        });
    }

    // Generate shortened hash
    const hash = crypto.createHash('md5')
        .update(req.body.original_link + Date.now().toString())
        .digest('hex')
        .substring(0, 8);

    // Create new link document
    const new_link = new Link({
        original_link: req.body.original_link,
        shortened_link: hash,
    });

    // Save to database
    new_link.save((err, link) => {
        if (err) {
            return res.status(500).json({
                error: 'Error saving link',
                details: err.message
            });
        }
        res.status(201).json(link);
    });
};

// Update link
exports.updateLink = async (req, res) => {
    try {
        const linkId = req.params.id;
        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(linkId)) {
            return res.status(400).json({
                error: 'Invalid ID format'
            });
        }
        // Check if link exists
        const existingLink = await Link.findById(linkId);
        if (!existingLink) {
            return res.status(404).json({
                error: 'Link not found'
            });
        }

        // Validate required fields if they are being updated
        const requiredFields = ['original_link', 'shortened_link'];
        const updateFields = Object.keys(req.body);
        const missingFields = requiredFields
            .filter(field => updateFields.includes(field) && !req.body[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({
                error: 'Missing required fields',
                missingFields: missingFields
            });
        }

        // Update the document
        const updatedLink = await Link.findOneAndUpdate(
            { _id: linkId },
            updateData,
            { 
                new: true,
                runValidators: true
            }
        );

        res.status(200).json(updatedLink);
    } catch (err) {
        res.status(500).json({
            error: 'Error updating link',
            details: err.message
        });
    }
};

// Delete link
exports.deleteLink = (req, res) => {
    const linkId = req.params.id;
    Link.findByIdAndDelete(linkId, function(err, link) {
        if (err) {
            res.send(err);
        }
        res.json(link);
    });
};

// Get link by shortened link
exports.getLinkByShortenedLink = async (req, res) => {
    try {
        const shortenedLink = req.query.link;
        
        if (!shortenedLink) {
            return res.status(400).json({ message: 'Link query parameter is required' });
        }

        const link = await Link.findOne({ shortened_link: shortenedLink });
        
        if (!link) {
            return res.status(404).json({ message: 'Link not found' });
        }
        await link.save();
        
        res.status(200).json({ original_link: link.original_link });
    } catch (error) {
        res.status(500).json({ 
            error: 'Error finding link',
            details: error.message 
        });
    }
};
