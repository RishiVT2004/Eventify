import Event from "../../models/EventModel.js";
import RegisteredUser from "../../models/RegisteredUsers.js";

export const EventAnalytics = async(req,res) => {
    if(!req.admin){
        return res.status(403).json({ message: "Admin access only" });
    }
    try{
        const {eventID} = req.params;
        const event = await Event.findById(eventID);
        //const regiseredUser = await RegisteredUser.findById(eventID)

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        const soldTickets = event.Capacity - event.Tickets_Availiable
        const netRevenue = (event.Price)*soldTickets
        
        const eventAnalytics = {
            "Event Name" : event.Name,
            "Event Date" : event.Date,
            "Event Location" : event.Location,
            "Tickets Sold" : soldTickets,
            "Remaining Tickets" : event.Tickets_Availiable,
            "Revenue Generated" : netRevenue,
            /*
            Attendees : regiseredUser.map(user => ({
                name : user.UserName,
                email : user.EmailID,
            }))
            */
        }
        return res.status(200).json(eventAnalytics);
    }catch(err){
        return res.status(500).json({
            message: "Server Error",
            error: err.message
        });
    }
}