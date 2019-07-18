import DatePicker from "./DatePicker.vue";
import Calendar from "./components/Calendar";
import Month from "./components/Calendar/Month.vue";

const install = Vue => {
  Vue.component("DatePicker", DatePicker);
  Vue.component("Calendar", Calendar);
  Vue.component("Month", Month);
};

export default DatePicker;

export { DatePicker, Calendar, Month };
