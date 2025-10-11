import { BadRequestException, Controller, Post,UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('api/uploads')
export class UploadsController {

    @Post()
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination:'./uploads/images',
            filename:(req, file, cb) => {
                const prefix = `${Date.now()}-${Math.round(Math.random()* 1000000)}`;
                const fileName = `${prefix}-${file.originalname}`;
                cb(null, fileName)
            }
        })
    }))
    public uploadFile(@UploadedFile()file :Express.Multer.File){
        if(!file) throw new BadRequestException("no file Provided")
        return {message : 'File Uploaded successfully', file }
    }
}
