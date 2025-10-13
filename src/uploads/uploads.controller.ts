import { BadRequestException, Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import express from 'express';
import { diskStorage } from 'multer';

@Controller('api/uploads')
export class UploadsController {

    @Post()
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads/images',
            filename: (req, file, cb) => {
                const prefix = `${Date.now()}-${Math.round(Math.random() * 1000000)}`;
                const fileName = `${prefix}-${file.originalname}`;
                cb(null, fileName)
            },
        }),
        fileFilter: (req, file, cb) => {
            if (file.mimetype.startsWith('image')) {
                cb(null, true)
            } else {
                cb(new BadRequestException('Unsupported file format'), false)
            }
        },
        limits:{fileSize:1024 * 1024 *5}
    }))
    public uploadFile(@UploadedFile() file: Express.Multer.File) {
        if (!file) throw new BadRequestException("no file Provided")
        return { message: 'File Uploaded successfully', file }
    }
    @Get(':image')
    public showUploadedImage(@Param('image') image:string, @Res() res: express.Response){
        return res.sendFile(image, {root:'uploads/images'})
    }
}
