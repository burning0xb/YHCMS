import { Template } from 'meteor/templating';
import { MiniCode } from '../../../universal/collections';
import { get, set } from '../../stores/uiactions/storeList.action';
import { getCitys, setCitys } from '../../stores/uiactions/storeCitys.action';
import { showSpin, closeSpin } from '../../stores/uiactions/spin.action';
import { ReactiveVar } from "meteor/reactive-var";
import Http from '../../Http';

Template.miniEditor.onCreated(function() {
  const params = {
    cityid: 1
  };
  Http.get({
    url: 'https://activity.yonghuivip.com/api/app/shop/storelist',
    params
  })
  .then(response => {
    if (response.code === 0 && response.data) {
      set(response.data.list);
    }
  })
  Http.get({
    url: 'https://activity.yonghuivip.com/api/app/shop/citys'
  })
  .then(response => {
    if (response.code === 0 && response.data) {
      const citys = response.data.citys;
      setCitys(citys);
    }
  })
})

Template.miniEditor.events({
  'click #createMiniCode' (event, instance) {
    const cityId = instance.$(event.currentTarget).parents('.mini-editore-page').find('#city').val();
    const storeId = instance.$(event.currentTarget).attr('data-storeId');
    const storeName = instance.$(event.currentTarget).attr('data-storeName');
    const sellerId = instance.$(event.currentTarget).attr('data-sellerId');
    const projId = instance.$(event.currentTarget).parents('.mini-editore-page').find('#projId').val();
    if (projId === '') {
      alert('请填写项目id');
      return;
    }
    showSpin();
    console.log(storeId);
    const params = {
      storeId, storeName, projId, cityId, sellerId
    };
    Http.get({
      url: '/createMiniCode',
      params
    })
    .then(response => {
      console.log(response);
      closeSpin();
      if (response.code !== '0000') {
        alert(response.error);
      }
    }).catch((err) => {
      alert(err);
      closeSpin();
    })
  },
  'change #city' (event, instance) {
    const params = {
      cityid: event.currentTarget.value,
      isonlyscancode: 1
    };
    Http.get({
      url: 'https://activity.yonghuivip.com/api/app/shop/storelist',
      params
    })
    .then(response => {
      if (response.code === 0 && response.data) {
        set(response.data.list);
      }
    })
  }
})

Template.miniEditor.helpers({
  mini: () => {
    const images = {};
    const _list = MiniCode.find({}).fetch();
    console.log();
    if (_list.length > 0) {
      _list.map((key) => {
        images[key.storeId] = key.miniCodeUrl;
      });
    }
    const list = get();
    if (list && list.length > 0) {
      list.map((res) => {
        res.stores.map((key) => {
          key.miniCodeUrl = images[key.id];
        })
      });
    }
    return list;
  },
  citys: () => {
    return getCitys();
  }
})
