const asyncHandler = require('express-async-handler')
const SchedaSpese = require("../model/schedaSpeseModel")
const User = require("../model/userModel")
const NotaSpese = require("../model/notaSpeseModel")
const nodemailer = require("nodemailer");
const baseUrl = process.env.NODE_ENV === "development"? process.env.DEV_BASE_URL : process.env.PORDUCTION_BASE_URL; 

//@desc get goals
//@route GET /api/goals
//@access Private
const getSchedaSpese = asyncHandler(async (req, res) => {
    // Find all schedaSpese for the current user
    const schedaSpese = await SchedaSpese.find({ user: req.user.id });
  
    // Map over each scheda and resolve the promises for each notaSpese
    const schedaSpeseWithNota = await Promise.all(
      schedaSpese.map(async (scheda) => {
        // console.log(scheda.notaSpese, "scheda.notaSpese"); // Debugging
        
        // Resolve all the NotaSpese promises for the current scheda
        const notaSpeseResolved = await Promise.all(
          scheda.notaSpese.map((notaId) => {
            return NotaSpese.findById(notaId);
          })
        );
        
        // You might want to attach the resolved notaSpese to the scheda
        return { ...scheda.toObject(), notaSpese: notaSpeseResolved };
      })
    );

    res.status(200).json(schedaSpeseWithNota.reverse());
  });

//@desc set schedaSpese
//@route POST /api/schedaSpese
//@access Private
const setSchedaSpese = asyncHandler(async (req, res) => {
    
    if(!req.body.titolo) {
        res.status(400)
        throw new Error("add titolo in body") //restituisce l'errore in html per ricevere un json fare middleware 
    }

    const notaSpese = await SchedaSpese.create({ 
        titolo: req.body.titolo,
        inserimentoData: req.body.inserimentoData,
        notaSpese: req.body.notaSpese,
        condivisoCon: req.body.condivisoCon,
        user: req.user.id
    })

    if(req.body.condivisoCon.length > 0) {
        // Create a test account or replace with real credentials.
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: "tommasoversetto@gmail.com",
                pass:  process.env.GOOGLE_SMTP_PASS,
            },
        });
        // Get the sender's full user information to access their email
        const sender = await User.findById(req.user.id);

        try {
            const info = await transporter.sendMail({
                from: `${sender.name} <${sender.email}>`,  // Properly formatted sender
                // to: req.body.condivisoCon.join(','),  // Array of emails joined by commas
                to: req.body.condivisoCon,  // Array of emails joined by commas
                subject: "Shared Expense Sheet",
                text: `An expense sheet "${req.body.titolo}" has been shared with you.`,
                html: `<b>Registrati: <a href="${baseUrl}/register">Registrati</a><br>Accedi: <a href="${baseUrl}/login">Accedi</a></b>`,
            });
            
            console.log("Message sent:", info.messageId);
        } catch (error) {
            console.error("Error sending email:", error);
        }
    }

    res.status(200).json(notaSpese)
})

// //@desc update schedaSpese
// //@route PUT/PATCH /api/goals/:id
// //@access Private
const updateSchedaSpese = asyncHandler(async (req, res) => {
    // console.log(req.body, '--------------updateSchedaSpese req.body'); // Debugging
    const { notaSpese, titolo } = req.body;
    const schedaId = req.params.id;

    // Find the schedaSpese by ID
    const scheda = await SchedaSpese.findById(schedaId);
    if (!scheda) {
        res.status(404);
        throw new Error("Scheda not found");
    }

    // Check if user exists
    if (!req.user) {
        res.status(401);
        throw new Error("User not found");
    }

    // Check if the user is the owner
    if (scheda.user.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User not authorized");
    }

    // Construct the update object dynamically
    const updateFields = {};
    if (notaSpese) {
        updateFields.$push = { notaSpese };
    }
    if (titolo) {
        updateFields.$set = { titolo };
    }
    // console.log(updateFields, '--------------updateFields'); // Debugging
    // Update and push the new notaSpese entry
    const updatedScheda = await SchedaSpese.findByIdAndUpdate(
        schedaId,
        updateFields,
        { new: true, runValidators: true }
    );
    
    // console.log(updatedScheda, '--------------updatedScheda'); // Debugging

    res.status(200).json(updatedScheda);
});


// //@desc cancel SchedaSpese
// //@route DELETE /api/schedaSpese/:id
// //@access Private
const deleteSchedaSpese = asyncHandler(async (req, res) => {
    const schedaSpese = await SchedaSpese.findById(req.params.id);
    if(!schedaSpese) {
        throw new Error("goal not found")
    }
    //check user
    if(!req.user) {
        res.status(401)
        throw new Error("user not found")
    }
    //check if user is owner
    if(schedaSpese.user.toString() !== req.user.id){
        res.status(401)
        throw new Error("user not authorized")
    }
    // await Goal.findByIdAndDelete(req.params.id) //soluzione mia al volo rifaccio la query 
    await schedaSpese.deleteOne(); //remove() is not a function ??
    res.status(200).json({id:req.params.id}) //porta in FE solo ID dell'elemento eliminato 
})

module.exports = {
    getSchedaSpese,
    setSchedaSpese,
    updateSchedaSpese,
    deleteSchedaSpese
}