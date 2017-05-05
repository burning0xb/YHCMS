import { Template } from 'meteor/templating';
import { openModal, closeModal } from '../../stores/uiactions/modal.action';
import { Projects } from '../../../universal/collections';
import { showSpin, closeSpin } from '../../stores/uiactions/spin.action';
import { getStore as getSearchStore } from '../../stores/uiactions/search.action';
import { getStore } from '../../stores/uiactions/willdelete.action';

Template.home.onCreated(function(){
})

const types = ['image', 'svg', 'html'];

Template.home.events({
  'click #delete'(event, instance) {
    if (getStore().proj.length === 0) {
      alert('请至少选中一项');
      return;
    }
    showSpin();
    Meteor.call('deleteProj', getStore().proj, (err, result) => {
      if (!err) {
        console.log(result);
        alert(result);
        closeSpin();
      }
    });
  }
});

Template.home.helpers({
  openProject: ()=>{
    return (project)=>{
      const {
        _id, type
      } = project;
      if (types.includes(type)) {
        FlowRouter.go(`${type}editor`, {projectid:_id});
      } else {
        console.log('自定义页面');
      }
    }
  },
  addProject: ()=>{
    return ()=>{
      openModal({title: '新建项目', contentTPL: 'addProject'});
    }
  },
  projects: ()=>{
    const searchObj = {};
    if (getSearchStore() !== '') {
      searchObj.name = new RegExp(`${getSearchStore()}`);
    }
    return Projects.find(searchObj);
  },
  user: () => {
    return Meteor.userId();
  },
  view: () => {
    if (Meteor.user() && Meteor.user().profile && Meteor.user().profile.isView) {
      return true;
    } else {
      return false;
    }
  }
})
