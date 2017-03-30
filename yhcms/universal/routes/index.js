import {
  renderBasic,
  renderSlim
} from './helpers';

function route(FlowRouter) {
  FlowRouter.route('/',{
    name:'home',
    action: renderBasic.bind(this,'home')
  })
  FlowRouter.route('/svg/:projectid',{
    name:'svgeditor',
    action: renderBasic.bind(this,'svgEditor')
  })
  FlowRouter.notFound = {
    action: renderSlim.bind(this,'notFound')
  }
}

export default route;