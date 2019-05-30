<template>
  <div class="month">
    <div class="month-title">
      {{ dateMonth.toLocaleString(this.lang, { month: "long" }) }}
      {{ dateMonth.getFullYear() }}
    </div>
    <table cellspacing="0" cellpadding="0">
      <tr>
        <th v-for="day in weekday" :key="day">
          {{ day }}
        </th>
      </tr>

      <tr v-for="(weeks, index) in days" :key="index">
        <Day
          :date="date"
          :dateMonth="dateMonth"
          v-if="date"
          :key="date"
          v-for="date in weeks"
          :startDisable="startDisable"
        />
        <td v-else></td>
      </tr>
    </table>
  </div>
</template>

<script>
import Day from "./Day.vue";
import _ from "lodash-es";

export default {
  name: "Month",
  components: {
    Day
  },
  computed: {
    days() {
      let days = [];
      if (this.dateMonth.getDay() > 0) {
        days = Array(this.dateMonth.getDay() - 1); //Воссоздаем пропущеные дни недели на нaчало месяца (-1 день недели для сдвига дней недель)
      } else {
        days = Array(6);
      }
      let lastDay = new Date(
        this.dateMonth.getFullYear(),
        this.dateMonth.getMonth() + 1,
        0
      );
      days = days.concat(_.range(1, lastDay.getDate() + 1)); // Заполняем днями месяца
      if (lastDay.getDay() != 0)
        days = days.concat(Array(7 - (days.length % 7))); //Воссоздаем пропущеные дни недели на конец месяца (+1 день недели для сдвига дней недель)

      return _.chunk(days, 7); // Разбиваем по неделям
    },
    weekday() {
      return this.days[1].map(date =>
        new Date(
          this.dateMonth.getFullYear(),
          this.dateMonth.getMonth(),
          date
        ).toLocaleString(this.lang, { weekday: "short" })
      );
    }
  },
  async mounted() {
    await this.$nextTick();
    if (
      this.$parent.orientation == "vertical" &&
      this.$parent.dateIn &&
      this.dateMonth.getFullYear() == this.$parent.dateIn.getFullYear() &&
      this.dateMonth.getMonth() == this.$parent.dateIn.getMonth()
    ) {
      setTimeout(() => {
        this.$el.scrollIntoView({ block: "center", behavior: "smooth" });
      }, 500);
    }
  },
  props: {
    dateMonth: {
      type: Date,
      required: true
    },
    startDisable: {
      type: Date,
      required: true,
      default: () => new Date(),
    },
    lang: {
      default: 'ru-RU',
      type: String,
      validator(value) {
        return ['ru-RU', 'en-US'].includes(value);
      }
    },
  }
};
</script>

<style lang="scss" scoped>
.month {
  display: inline-block;
  table {
    border-collapse: collapse;
    th {
      text-align: center;
      line-height: 18px;
      text-transform: lowercase;
      font-size: 14px;
      font-weight: 400;
      padding: 8px 0;
      &:nth-child(7n-1),
      &:nth-child(7n) {
        color: #f51449;
      }
    }
  }
  &-title {
    text-align: center;
    font-size: 17px;
    text-transform: capitalize;
  }
}
</style>
