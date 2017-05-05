import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';
import path from 'path';
import fs from 'fs';
import { deleteSvg, deleteImage, deleteHtml, svgUploaded, imageUploaded, htmlUploaded, deleteProj, downloadSVG } from './service';
import { createCss } from './service/plugin'
import { checking } from './security';
import config from '../config.json';

const projPath = path.join(config.uplaodPath, 'uploads');

Meteor.startup(() => {
    // code to run on server at startup
    console.log(`meteor start listen ${process.env.ROOT_URL}`);
    console.log(`wellcom to yhcms ^ ^`);
});

Meteor.methods({
    createCss: function(projName) {
      checking(this, { projName });
      return createCss(projName).then((res) => {
          console.log(res);
          return res.url;
      });
    },
    createDir: function(projectname, projecttype) {
      checking(this, { projectname, projecttype });
      const projDirPath = path.join(projPath, `${projecttype}/${projectname.replace(/\s+/g, '')}`);
      if (!fs.existsSync(projDirPath)) {
          fs.mkdirSync(projDirPath);
      }
    },
    svgUploaded: function(file) {
      checking(this, { file });
      return svgUploaded(file).then((res) => {
        console.log(res.msg || res.err);
        return res.flag;
      });
    },
    imageUploaded: function(file) {
      checking(this, { file });
      return imageUploaded(file).then((res) => {
        console.log(res.msg);
        return res.flag;
      });
    },
    htmlUploaded: function(file) {
      checking(this, { file });
      return htmlUploaded(file).then((res) => {
        console.log(res.msg || res.err);
        return res.flag;
      });
    },
    deleteSvg: function(fileIds) {
      checking(this, { fileIds });
      return deleteSvg(fileIds).then((res) => {
        console.log(res);
        return res.msg;
      });
    },
    deleteImage: function(fileIds) {
      checking(this, { fileIds });
      return deleteImage(fileIds).then((res) => {
        console.log(res);
        return res.msg;
      });
    },
    deleteHtml: function(fileIds) {
      checking(this, { fileIds });
      return deleteHtml(fileIds).then((res) => {
        console.log(res);
        return res.msg;
      });
    },
    deleteProj: function(projIds) {
      checking(this, { projIds });
      console.log(`prepare to delete proj id is => ${projIds}`);
      return deleteProj(projIds).then((res) => {
        console.log(res);
        return res.msg;
      });
    }
});

WebApp.connectHandlers.use('/downloadSVG', (req, res) => {
  if (!req.query.fileIds || (req.query.fileIds && req.query.fileIds.split(',').length === 0)) {
    res.setHeader('Content-Type', 'application/json');
    res.end({
      error: 'fileIds is require'
    })
  }
  downloadSVG(req, res);
});
