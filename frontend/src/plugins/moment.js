import moment from "moment"
import VueMomentJS from "vue-momentjs"

moment.locale('es')
export default ({ Vue }) => {
  Vue.use(VueMomentJS, moment)
}