import { User } from "../models/User"
import type { Request, Response } from "express"
import { formatErrorMessage } from "../utils/utils"
import cloudinary from "../config/cloudinary"

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find().select("-password -_id")
        res.json(users)
    } catch (error) {
        res.status(500).json(formatErrorMessage("Error retrieving users", error))
    }
}

export const createUser = async (req: Request, res: Response) => {
    try {
        const { userId, username, email, password, role, planetId } = req.body
        let imageUrl = ""

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "geb-images",
                public_id: userId,
            })
            imageUrl = result.secure_url
        }

        const newUser = new User({
            userId,
            username,
            email,
            password,
            role,
            planetId,
            images: {
                base: imageUrl,
            },
        })
        await newUser.save()
        res.status(201).json(newUser)
    } catch (error) {
        res.status(500).json(formatErrorMessage("Error creating user", error))
    }
}

export const updateUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params
        const updateData = req.body
        if (req.files && (req.files as Express.Multer.File[]).length > 0) {
            updateData.images = await uploadImages(req.files as Express.Multer.File[])
        }
        const updatedUser = await User.findOneAndUpdate({ userId }, updateData, { new: true })
        if (!updatedUser) {
            res.status(404).json(formatErrorMessage("User not found"))
            return
        }
        res.json(updatedUser)
    } catch (error) {
        res.status(500).json(formatErrorMessage("Error updating user", error))
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params
        const deletedUser = await User.findOneAndDelete({ userId })
        if (!deletedUser) {
            res.status(404).json(formatErrorMessage("User not found"))
            return
        }
        res.json({ message: "User deleted successfully" })
    } catch (error) {
        res.status(500).json(formatErrorMessage("Error deleting user", error))
    }
}

export const uploadUserImage = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params
        const file = req.file
        if (!file) {
            res.status(400).json(formatErrorMessage("No image file provided"));
            return;
        }
        const result = await cloudinary.uploader.upload(file.path)
        const updatedUser = await User.findOneAndUpdate(
            { userId },
            { $set: { "images.base": result.secure_url } },
            { new: true },
        )
        if (!updatedUser) {
            res.status(404).json(formatErrorMessage("User not found"));
            return;
        }
        res.json(updatedUser)
    } catch (error) {
        res.status(500).json(formatErrorMessage("Error uploading user image", error))
    }
}

async function uploadImages(files: Express.Multer.File[]) {
    const uploadedImages: { base: string; second?: string; third?: string } = { base: "" }
    for (let i = 0; i < files.length && i < 3; i++) {
        const result = await cloudinary.uploader.upload(files[i].path)
        if (i === 0) uploadedImages.base = result.secure_url
        else if (i === 1) uploadedImages.second = result.secure_url
        else if (i === 2) uploadedImages.third = result.secure_url
    }
    return uploadedImages
}

