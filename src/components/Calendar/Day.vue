<template>
  <td
    class="day"
    :class="{
      active: isActive,
      select: isSelect,
      'current-date': isCurrentDate,
      disabled: isDisabled
    }"
    @click="onClickDay()"
    @mouseover="onHoverSet"
    @mouseleave="onHoverRemove"
  >
    {{ date }}
  </td>
</template>

<script>
export default {
  name: "Day",
  components: {},
  props: {
    dateMonth: {
      type: Date,
      required: true
    },
    date: {
      type: Number,
      required: true
    },
    startDisable: {
      type: Date,
      required: true,
      default: () => new Date()
    }
  },
  computed: {
    dateIn() {
      return this.$parent.$parent.dateIn;
    },
    dateOut() {
      return this.$parent.$parent.dateOut;
    },
    dateSingle() {
      return this.$parent.$parent.dateSingle;
    },
    timeCurrentDay() {
      return new Date(
        this.dateMonth.getFullYear(),
        this.dateMonth.getMonth(),
        this.date
      );
    },
    isActive() {
      // Если выбрана левая часть
      let isLeft =
        this.dateIn &&
        this.timeCurrentDay.getFullYear() == this.dateIn.getFullYear() &&
        this.timeCurrentDay.getMonth() == this.dateIn.getMonth() &&
        this.timeCurrentDay.getDate() == this.dateIn.getDate();
      // Если выбрана как правая часть
      let isRight =
        this.dateOut &&
        this.timeCurrentDay.getFullYear() == this.dateOut.getFullYear() &&
        this.timeCurrentDay.getMonth() == this.dateOut.getMonth() &&
        this.timeCurrentDay.getDate() == this.dateOut.getDate();
      let isSingle =
        this.dateSingle &&
        this.timeCurrentDay.getFullYear() == this.dateSingle.getFullYear() &&
        this.timeCurrentDay.getMonth() == this.dateSingle.getMonth() &&
        this.timeCurrentDay.getDate() == this.dateSingle.getDate();
      return isLeft || isRight || isSingle;
    },
    isSelect() {
      //  Если дата правее выбраной левой части
      let isLeft =
        this.dateIn && this.timeCurrentDay.getTime() >= this.dateIn.getTime();
      // Если дата левее выбраной правой части
      let isRight =
        this.dateOut && this.timeCurrentDay.getTime() < this.dateOut.getTime();
      return isLeft && isRight;
    },
    isCurrentDate() {
      let toDay = new Date();
      return (
        this.timeCurrentDay.getFullYear() == toDay.getFullYear() &&
        this.timeCurrentDay.getMonth() == toDay.getMonth() &&
        this.timeCurrentDay.getDate() == toDay.getDate()
      );
    },
    isDisabled() {
      return (
        this.timeCurrentDay.getTime() + 86400000 < this.startDisable.getTime() // -1 день (в мсек)
      );
    }
  },
  methods: {
    onHoverSet() {
      this.$parent.$parent.hoverDate = this.timeCurrentDay;
    },
    onHoverRemove() {
      this.$parent.$parent.hoverDate = null;
    },
    onClickDay() {
      if (this.$parent.$parent.type == "range") {
        this.rangeDayClick();
      }
      if (this.$parent.$parent.type == "single") {
        this.singleDayClick();
      }
    },
    singleDayClick() {
      this.$parent.$parent.dateSingle = this.timeCurrentDay;
    },
    rangeDayClick() {
      // Если есть заблокированые даты проверяем их
      if(this.$parent.employment && (this.dateIn || this.dateOut) && !(this.dateIn && this.dateOut)) {
        const anotherPoint = (this.dateIn && this.dateIn.getTime()) || (this.dateOut && this.dateOut.getTime())
        const leftPart = Math.min(this.timeCurrentDay.getTime(), anotherPoint ) + (86400000-1);
        const rightPart = Math.max(this.timeCurrentDay.getTime(), anotherPoint );
        
        // Пример расчетных дат
        // Mon Sep 09 2019 23:59:59 GMT+0400 (Самарское стандартное время) 
        // Tue Sep 10 2019 00:00:00 GMT+0400 (Самарское стандартное время)
        
        const isEmploy = this.$parent.employment.find(value => {
          // console.log(
          //   "Занятость внутри промежутка",
          //   value.from.getTime() <= leftPart && leftPart < value.to.getTime() ,
          //   value.from.getTime() <= rightPart && rightPart < value.to.getTime(),
            
          //   "Между выбраным есть занятость",
          //   leftPart <= value.from.getTime() && value.from.getTime() < rightPart,
          //   leftPart <=  value.to.getTime() && value.to.getTime() < rightPart
          // );
          return (
            value.from.getTime() <= leftPart && leftPart < value.to.getTime() &&
            value.from.getTime() <= rightPart && rightPart < value.to.getTime() ||

            (leftPart <= value.from.getTime() && value.from.getTime() < rightPart ||
            leftPart <=  value.to.getTime() && value.to.getTime() < rightPart)
          )
        })
        // Можно сделать выбрасывание ошибки, но хер с ней
        if(isEmploy) return;
      }

      if (
        !this.dateIn ||
        (this.$parent.$parent.changeRange == "in" &&
          this.dateOut &&
          this.timeCurrentDay.getTime() != this.dateOut.getTime())
      ) {
        // На случай если есть дата отъезда и мы нажали на нее
        if (
          !this.dateOut ||
          (this.dateOut &&
            this.timeCurrentDay.getTime() != this.dateOut.getTime())
        ) {
          this.$parent.$parent.dateIn = this.timeCurrentDay;
        } else {
          this.$parent.$parent.dateOut = null;
          // return;
        }
        return;
      } else {
        if (this.timeCurrentDay.getTime() == this.dateIn.getTime()) {
          this.$parent.$parent.dateIn = null;
          return;
        }
      }
      if (!this.dateOut || this.$parent.$parent.changeRange == "out") {
        this.$parent.$parent.dateOut = this.timeCurrentDay;
        return;
      } else {
        if (this.timeCurrentDay.getTime() == this.dateOut.getTime()) {
          this.$parent.$parent.dateOut = null;
          return;
        }
      }
      if (this.dateIn && this.dateOut) {
        this.$parent.$parent.dateOut = null;
        this.$parent.$parent.dateIn = this.timeCurrentDay;
        return;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.day {
  text-align: center;
  font-size: 14px;
  width: 38px;
  height: 38px;
  cursor: pointer;
  border: 1px solid rgb(228, 231, 231);
  box-sizing: border-box;
  vertical-align: middle;


  &.day-employment {
    &__both {
      background: pink;
      pointer-events: none;
      border-left-color: pink !important;
      border-right-color: pink !important;
    }
    &__left {
      background: linear-gradient(to right, pink, pink 50%, transparent 50%, transparent);
      border-left-color: pink !important;
    }
    &__right {
      background: linear-gradient(to left, pink, pink 50%, transparent 50%, transparent);
      border-right-color: pink !important;
    }
  }

  &.disabled {
    pointer-events: none;
    opacity: 0.25;
  }
  &.select {
    background-color: rgb(208, 231, 253);
    border-color: rgb(208, 231, 253);
  }
  &.active {
    background-color: rgb(111, 167, 89);
    color: white;
    // border-color: rgb(111, 167, 89);
  }
  &:hover {
    background-color: rgba(111, 167, 89, 0.75);
    color: white;
    // border-color: rgba(111, 167, 89, 0.75);
  }
  &.current-date {
    position: relative;
    &:before {
      position: absolute;
      content: "";
      display: block;
      width: calc(100% + 1px);
      height: calc(100% + 1px);
      top: 0;
      left: 0px;
      border: 1px solid red;
      box-sizing: border-box;
    }
  }
}
</style>
