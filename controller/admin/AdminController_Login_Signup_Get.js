import Admin from "../../models/AdminModel.js";
import BannedUser from "../../models/BannedUser.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import zod from "zod";
import mongoose from "mongoose";
const JWT_KEY = process.env.JWT_KEY;
import { sendEmailNotification } from "../../utils/email.js";

const calcAge = (dob) => {
  const birthDate = new Date(dob);
  const currAge = Date.now() - birthDate.getTime();
  const newCurrAge = new Date(currAge);
  return Math.abs(newCurrAge.getUTCFullYear - 1970);
};
export const adminSignup = async (req, res) => {
  try {
    const { Username, Password, AdminInfo } = req.body;
    const email = AdminInfo.EmailID;
    const BanUser = await BannedUser.findOne({ email });
    if (BanUser) {
      return res.status(403).json({
        message: "This email has been banned and cannot be used for signup",
      });
    }
    // Input Validation

    const InputSchema = zod.object({
      Username: zod.string().min(8),
      Password: zod.string().min(8),
      AdminInfo: zod.object({
        Name: zod.string(),
        DOB: zod.string().refine((date) => !isNaN(Date.parse(date)), {
          message: "Invalid date format , date format must be year--month--day",
        }),
        Gender: zod.string(),
        EmailID: zod.string().email(),
        PhoneNo: zod.string().length(10),
      }),
    });

    const ParsedInput = InputSchema.safeParse(req.body);

    if (!ParsedInput.success) {
      return res.status(400).json({
        message: "Error in parsing",
        errors: ParsedInput.error.errors, // Return detailed errors
      });
    }

    const Age = calcAge(ParsedInput.data.AdminInfo.DOB);
    if (Age < 18) {
      return res.status(400).json({
        message: "You must be at least 18 years old to register as an admin.",
      });
    }

    // checking if admin exists
    const CheckEmail = ParsedInput.data.AdminInfo.EmailID;
    const DoesAdminAlreadyExist = await Admin.findOne({
      "AdminInfo.EmailID": CheckEmail,
    });
    if (DoesAdminAlreadyExist) {
      return res.status(400).json({ error: "User is already Registered" });
    }

    // hashing
    const HashedPassword = await bcrypt.hash(ParsedInput.data.Password, 10);
    const HashedPhoneNo = await bcrypt.hash(ParsedInput.data.AdminInfo.PhoneNo, 10);

    const newAdmin = await Admin.create({
      Username: ParsedInput.data.Username,
      Password: HashedPassword,
      AdminInfo: {
        Name: ParsedInput.data.AdminInfo.Name,
        DOB: ParsedInput.data.AdminInfo.DOB,
        Gender: ParsedInput.data.AdminInfo.Gender,
        EmailID: ParsedInput.data.AdminInfo.EmailID,
        PhoneNo: HashedPhoneNo,
      },
    });

    // apply jwt signin here
    const token = jwt.sign({
        id: newAdmin._id,
        role: "admin",
    },JWT_KEY,{
      expiresIn: "1hr" 
    });

    try {
      await sendEmailNotification(
        NewUser.UserInfo.EmailID,
        "Welcome to Eventify",
        `Hello ${NewUser.UserInfo.Name},\n\nYour admin account has been successfully created. Welcome aboard!\n\nRegards,\nTeam Eventify`
      );
    } catch (err) {
      return res.status(500).json({ error: "failed to send email" });
    }

    return res.status(201).json({
      message: "Admin registered successfully!",
      token: token,
    });
  } catch (err) {
    return res.status(403).json({
      message: "invalid input credentials",
      error: err.message,
    });
  }
};

export const adminLogin = async (req, res) => {
  const { Username, Password } = req.body;

  const InputSchema = zod.object({
    Username: zod.string().min(8),
    Password: zod.string().min(8),
  });

  const ParsedInput = InputSchema.safeParse({ Username, Password });

  if (ParsedInput.success) {
    try {
      const ExistingAdmin = await Admin.findOne({
        Username: ParsedInput.data.Username,
      });
      if (!ExistingAdmin) {
        res.status(404).json("Admin not registered ...");
      }
      const IsCorrectPassword = await bcrypt.compare(
        ParsedInput.data.Password,
        ExistingAdmin.Password
      );
      const IsCorrectUsername =
        ParsedInput.data.Username === ExistingAdmin.Username;

      if (!IsCorrectPassword || !IsCorrectUsername) {
        return res.status(403).json({
          message: "Invalid Username or Password",
        });
      }
      // apply jwt signin here
      const token = jwt.sign(
        {
          id: ExistingAdmin._id,
          role: "admin",
        },
        JWT_KEY,
        {
          expiresIn: "1hr",
        }
      );
      return res.status(202).json({
        message: "Admin Login successful ",
        token: token,
      });
    } catch (err) {
      return res.status(404).json({ error: err });
    }
  } else {
    return res.status(403).json({
      message: "invalid input credentials .. please try again",
      error: ParsedInput.error.errors,
    });
  }
};

export const getAdminProfile = async (req, res) => {
  const admin = await Admin.findOne({ _id: req.admin.id });
  res.json({
    message: "Admin profile fetched successfully",
    profile: admin,
  });
};
