import Feedback from '../../models/FeedbackModel.js'; // Ensure you include .js
import Event from "../../models/EventModel.js"
import User from "../../models/UserModel.js"
import zod from 'zod'


export const PostReview = async(req,res) => {   
    if(!req.user){
        return res.status(403).json({message : "Only User can change respective info"})
    }
    const {eventID} = req.params
    try{
        const IsEventValid = await Event.findById(eventID);
        if(!IsEventValid){
            return res.status(404).json({ message: "Event not found" });
        }
        const eventName = IsEventValid.Name;
        const userID = req.user.id;
        const user = await User.findById(userID);
        const UserName = user.Username
        const {ratings , feedback} = req.body;

        if(!ratings || !feedback){
            return res.status(400).json({message : 'Incomplete Rating or Feedback field ... please fill them'});
        }

        if(ratings < 1 || ratings > 5){
            return res.status(400).json({message : 'Invalid Rating Score'});
        }

        const InputSchema = zod.object({
            eventID : zod.string(),
            eventName : zod.string(),
            Feedbacks : zod.array(zod.object({
                UserID : zod.string(),
                UserName : zod.string(),
                Ratings : zod.number(),
                Message : zod.string()
            }))
        })

        // Prepare the input for validation
        const inputToValidate = {
            eventID,
            eventName,
            Feedbacks: [{
                UserID: userID,
                UserName: UserName,
                Ratings: ratings,
                Message: feedback,
            }],
        };

        const ParsedInput = InputSchema.safeParse(inputToValidate);

        if(!ParsedInput.success) {
            return res.status(400).json({ message: 'Invalid input', errors: ParsedInput.error.errors });
        }

        // Proceed to add feedback to the event
        Feedback.Feedbacks.push({
            UserID: userID,
            UserName: UserName,
            Ratings: ratings,
            Message: feedback,
        });

        await Feedback.save(); // Save the updated event
    
        return res.status(201).json({
            message: "Review posted successfully",
            eventName: eventName,
            ratings: ratings,
            feedback: feedback,
        });
    }catch(err){
        return res.status(500).json({
            message: "Server Error",
            error: err.message,
        });
    }
}

export const GetReview = async(req,res) => {
    const {eventID} = req.params;
    try{
        const ValidEvent = await Event.findById(eventID);
        if(!ValidEvent){
            return res.status(404).json({ message: "Event not found" });
        }
        const reviewsForEvent = await Feedback.find(ValidEvent.Feedbacks)
        if(!reviewsForEvent){
            return res.status(404).json({ message: "No feedbacks or review found for Event"});
        }
        res.status(200).json({
            'Event_Name' : ValidEvent.Event_Name,
            'Reviews' : reviewsForEvent 
        })
    }catch(err){
        return res.status(500).json({
            message: "Server Error",
            error: err.message,
        });
    }
}