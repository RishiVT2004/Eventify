import Event from "../../models/EventModel.js"
import zod from 'zod'

// all fields are now optional to update 
const InputSchema = zod.object({
    Name : zod.string().max(40).optional(),
    Date : zod.string().optional(),
    Location : zod.string().optional(),
    Capacity : zod.number().min(20).optional(),
    Price : zod.number().min(99).optional()
}).partial()

export const createEvent = async(req,res) => {
    try{
        if (!req.admin) {
            return res.status(403).json({ message: "Only admins can create events" });
        }
        const {Name,Date,Location,Capacity,Price} = req.body;

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

export const eventList = async(req,res) => {
    try{   
        if(!req.admin){
            return res.status(403).json({ message: "Only admins can create events" });
        }
        const list = await Event.find()
        if(!list){
            return res.status(400).json({
                error : "No events found"
            })
        }
        return res.status(201).json({
            "message" : "Event List",
            "list" : list
        })
    }catch(err){
        return res.status(500).json({
            message : 'Server Error',
            error : err.message
        })
    }
}

export const updateEvent = async(req,res) => {
    const {eventID} = req.params
    try{
        if(!req.admin){
            return res.status(403).json({ message: "Only admins can create events" });
        }

        const ParsedInput = InputSchema.safeParse(req.body)
        
        if(!ParsedInput.success){
            return res.status(400).json({
                message : "Invalid Event Credentials... Try again",
                error : ParsedInput.error.errors
            })
        }

        const {Name,Date,Location,Capacity,Price} = ParsedInput.data;
        const updatedFields = {}
        if(Name){
            updatedFields.Name = Name;
        }
        if(Date){
            updatedFields.Date = Date;
        }
        if(Location){
            updatedFields.Location = Location;
        }
        if(Capacity){
            updatedFields.Capacity = Capacity;
        }
        if(Price){
            updatedFields.Price = Price;
        }
        
        //check for duplicate named event 
        if(updatedFields.Name){
            const checkDuplicateEventName = await Event.findOne({Name : updatedFields.Name});
            if(checkDuplicateEventName && checkDuplicateEventName._id.toString() != eventID){
                return res.status(400).json({
                    message: "Event name already exists. Please choose a different name.",
                });
            }
        } 

        const UpdatedEvent = await Event.findByIdAndUpdate(
            eventID,
            updatedFields,
            {new : true}
        )
        if(!UpdatedEvent){
            return res.status(500).json({
                error : "Unable to find event with the given id"
            })
        }

        return res.status(200).json({
            message : "event Updated",
            event : UpdatedEvent
        })
    }catch(err){
        return res.status(500).json({
            message : 'Server Error',
            error : err.message
        }) 
    }
}

export const deleteEvent = async(req,res) =>{
    try{
        if(!req.admin){
            return res.status(403).json({ message: "Only admins can create events" });
        }
        const {eventID} = req.params;
        const eventToBeDeleted = await Event.findByIdAndDelete({_id : eventID})
        if(!eventToBeDeleted){
            return res.status(500).json({
                error : "Unable to find event with the given id"
            })
        }
        return res.status(200).json({
            message : "event deleted succesfully ",
            deletedEvent : {ID : eventToBeDeleted._id , Name : eventToBeDeleted.Name},
        })
    }catch(err){
        return res.status(500).json({
            message : 'Server Error',
            error : err.message
        }) 
    }
}