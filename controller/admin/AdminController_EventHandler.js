import Event from "../../models/EventModel.js"
import zod from 'zod'


export const createEvent = async(req,res) => {
    try{
        if (!req.admin) {
            return res.status(403).json({ message: "Only admins can create events" });
        }
        const {Name,Date,Location,Capacity,Price} = req.body;

        const InputSchema = zod.object({
            Name : zod.string().max(40),
            Date : zod.string(),
            Location : zod.string(),
            Capacity : zod.number().min(20),
            Price : zod.number().min(99)
        })

        const ParsedInput = InputSchema.safeParse(req.body)
        if(!ParsedInput.success){
            return res.status(400).json({
                message : "Invalid Event Credentials... Try again",
                error : ParsedInput.error.errors
            })
        }

        const checkExistingEvent = await Event.findOne({"Name" : ParsedInput.Name})
        if(checkExistingEvent){
            return res.status(400).json({
                message : "Event of same name already exist"
            })
        }

        const newEvent = await Event.create({
            "Name" : ParsedInput.data.Name,
            "Date" : ParsedInput.data.Date,
            "Location" : ParsedInput.data.Location,
            "Capacity" : ParsedInput.data.Capacity,
            "Price" : ParsedInput.data.Price
        })

        return res.status(201).json({
            message : "Event Created Successfully",
            eventDetails : newEvent
        })
    }catch(err){
        return res.status(500).json({
            message : 'Server Error',
            error : err.message
        })
    }
}