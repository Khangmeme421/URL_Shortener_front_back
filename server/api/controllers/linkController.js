const mongoose = require('mongoose'),
Link = mongoose.model('link');

// Get all links
exports.getAllLinks = (req, res) => {
    Link.find({}, function(err, link) {
        if (err) {
            return res.send(err);
        }
        res.json(link);
    });
};

exports.getLinkById = (req, res) => {
    const linkId = req.params.id;
    Link.findOne({ original_link: linkId }, function(err, link) {
        if (err) {
            return res.status(500).send(err);
        }
        if (!link) {
            return res.status(404).json({ message: "Link not found" });
        }
        if (link._id.toString() === linkId) {
            return res.status(400).json({ message: "ID should not match original_link" });
        }
        res.json(link);
    });
};

// Create a new link
exports.createLink = (req, res) => {
    // Validate required fields
    const requiredFields = ['original_link', 'shortened_link', 'expires_at', 'last_clicked', 'created_by_ip'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
        return res.status(400).json({
            error: 'Missing required fields',
            missingFields: missingFields
        });
    }

    // Create new link document
    const new_link = new Link({
        original_link: req.body.original_link,
        shortened_link: req.body.shortened_link,
        expires_at: req.body.expires_at,
        last_clicked: req.body.last_clicked,
        click_count: 0, // Set default click count to 0
        created_by_ip: req.body.created_by_ip
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
        const requiredFields = ['original_link', 'shortened_link', 'expires_at', 'last_clicked', 'created_by_ip'];
        const updateFields = Object.keys(req.body);
        const missingFields = requiredFields
            .filter(field => updateFields.includes(field) && !req.body[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({
                error: 'Missing required fields',
                missingFields: missingFields
            });
        }

        // Remove click_count from update payload to prevent manual updates
        const { click_count, ...updateData } = req.body;

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
