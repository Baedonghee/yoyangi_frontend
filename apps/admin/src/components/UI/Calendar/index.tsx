import React, { RefObject, useRef, useState } from 'react';
import classNames from 'classnames';
import { format } from 'date-fns';
import styled from 'styled-components';
import { theme } from 'styles/theme';
import { useOnClickOutside } from 'usehooks-ts';
import { takeMonth } from 'utils/calendar';

import Down1 from 'components/SVG/icons/down1';
import Next from 'components/SVG/icons/next';
import Prev from 'components/SVG/icons/prev';

const Container = styled.div`
  width: 100%;
  padding: 24px 0 24px;
  box-shadow: 0 2px 8px 0 rgba(18, 44, 72, 0.15);
  border: 1px solid ${({ theme }) => theme.color.gray100};
  background-color: ${({ theme }) => theme.color.white};
  border-radius: 10px;
  position: relative;
  z-index: 1;
  .arrow {
    width: 50px;
    height: 25px;
    position: absolute;
    top: -25px;
    left: 50%;
    transform: translateX(-50%);
    overflow: hidden;
  }
  .cal-header {
    display: flex;
    align-items: center;
    padding: 0px 24px;
    margin-bottom: 16px;
    .prev {
      margin-right: 18px;
      &.disabled {
        background-color: ${({ theme }) => theme.color.gray200} !important;
        cursor: not-allowed !important;
      }
    }
    .prev,
    .next {
      cursor: pointer;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid ${({ theme }) => theme.color.gray300};
      border-radius: 6px;
      &:hover {
        background-color: ${({ theme }) => theme.color.gray100};
      }
    }
    .next {
      margin-left: 18px;
    }
    .month {
      .select {
        select {
          width: 68px;
          margin-right: 0;
        }
      }
    }
    .select {
      position: relative;
      cursor: pointer;
      select {
        width: 86px;
        cursor: pointer;
        padding: 7px 11px;
        font-size: ${({ theme }) => theme.fontSize.text14};
        font-weight: 500;
        color: ${({ theme }) => theme.color.gray900};
        margin-right: 2px;
        border-radius: 8px;
        background-color: ${({ theme }) => theme.color.white};
        border: 0;
        outline: 0;
        &:hover {
          background-color: ${({ theme }) => theme.color.gray100};
        }
        &::-ms-expand {
          display: none;
        }
        -webkit-appearance: none;
        -moz-appearance: none;
        text-indent: 1px;
        text-overflow: '';
      }
      svg {
        position: absolute;
        top: 50%;
        right: 12px;
        transform: translateY(-50%);
      }
    }
  }
  .cal-body {
    padding: 0px 24px;
    ul {
      li {
        display: flex;
        font-size: ${({ theme }) => theme.fontSize.text14};
        &.day {
          color: ${({ theme }) => theme.color.gray700};
        }
        & > span {
          display: flex;
          width: 36px;
          height: 36px;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          &.date {
            color: ${({ theme }) => theme.color.gray900};
            &:hover {
              border-radius: 50%;
              background-color: ${({ theme }) => theme.color.primary500};
              color: ${({ theme }) => theme.color.white};
            }
            &.sunday {
              color: ${({ theme }) => theme.color.red500};
              &:hover {
                color: ${({ theme }) => theme.color.white};
              }
            }
            &.saturday {
              color: ${({ theme }) => theme.color.primary700};
              &:hover {
                color: ${({ theme }) => theme.color.white};
              }
            }
          }
          &.selected {
            border-radius: 50%;
            background-color: ${({ theme }) => theme.color.primary500};
            color: ${({ theme }) => theme.color.white};
          }
          &.disabled {
            cursor: not-allowed;
            background-color: ${({ theme }) => theme.color.white};
            color: ${({ theme }) => theme.color.gray300} !important;
            border-radius: 50%;
            &:hover {
              opacity: 1;
              background-color: ${({ theme }) => theme.color.white};
              color: ${({ theme }) => theme.color.gray300};
            }
          }
        }
      }
    }
  }
`;

// 연도 데이터 생성
const yearsArray = Array.from({ length: 2027 - 1990 + 1 }, (_, index) => {
  return {
    value: index + 1990,
    name: `${index + 1990}년`,
  };
});

// 월 데이터 생성
const monthsArray = Array.from({ length: 12 }, (_, index) => {
  return {
    value: index + 1,
    name: `${index + 1}월`,
  };
});

interface ICalendar {
  date?: Date | null;
  onCancel: (e?: any) => void;
  onConfirm: (selectDay: Date) => void;
  startDate?: Date | null;
  endDate?: Date | null;
  type?: string;
}

const Calendar: React.FC<ICalendar> = ({ date, onCancel, onConfirm, startDate, endDate, type }) => {
  const [selectDate, setSelectDate] = useState(date || new Date());
  const [activeSelectDate, setActiveSelectDate] = useState<Date | null>(date ?? null);
  const [dayList, setDayList] = useState(takeMonth(selectDate)());
  const [selectYear, setSelectYear] = useState(format(selectDate, 'yyyy'));
  const [selectMonth, setSelectMonth] = useState(format(selectDate, 'M'));

  // 날짜컴포던트 다른곳 클릭시 닫힘
  const outsideRef: RefObject<HTMLDivElement> = useRef<HTMLInputElement | null>(null);

  useOnClickOutside(outsideRef, onCancel);

  const handlePrevDate = () => {
    // 선택된 날짜가 같은날이면 세팅 하지 않음 (검색이 아닐경우에만)
    if (type !== 'search' && format(new Date(), 'yyyyMM') === format(selectDate, 'yyyyMM')) {
      return;
    }
    const prevDate = new Date(selectDate);
    prevDate.setMonth(prevDate.getMonth() - 1);
    setSelectDate(prevDate);
    setDayList(takeMonth(prevDate)());
    setSelectYear(format(prevDate, 'yyyy'));
    setSelectMonth(format(prevDate, 'M'));
  };

  // 다음달 이동
  const handleNextDate = () => {
    const nextDate = new Date(selectDate);
    nextDate.setMonth(nextDate.getMonth() + 1);
    setSelectDate(nextDate);
    setDayList(takeMonth(nextDate)());
    setSelectYear(format(nextDate, 'yyyy'));
    setSelectMonth(format(nextDate, 'M'));
  };

  // 날짜 선택
  const onSelectDate = (selectDay: Date, disabled: boolean) => {
    if (disabled) {
      return;
    }
    // 선택된 날짜랑 같은날이면 선택 해제
    if (activeSelectDate && format(activeSelectDate, 'yyyyMMdd') === format(selectDay, 'yyyyMMdd')) {
      setActiveSelectDate(null);
      return;
    }
    setActiveSelectDate(selectDay);
    onConfirm(selectDay);
  };

  // 연도 선택
  const handleSelectYear = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectYear(e.target.value);
    const newDate = new Date(selectDate);
    newDate.setFullYear(Number(e.target.value));
    setSelectDate(newDate);
    setDayList(takeMonth(newDate)());
  };

  // 달 선택
  const handleSelectMonth = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectMonth(e.target.value);
    const newDate = new Date(selectDate);
    newDate.setMonth(Number(e.target.value) - 1);
    setSelectDate(newDate);
    setDayList(takeMonth(newDate)());
  };

  return (
    <Container ref={outsideRef}>
      <div className="cal-header">
        <div
          className={classNames('prev', { disabled: type !== 'search' && format(new Date(), 'yyyyMM') === format(selectDate, 'yyyyMM') })}
          onClick={handlePrevDate}
        >
          <Prev width="20" height="20" color={format(new Date(), 'yyyyMM') === format(selectDate, 'yyyyMM') ? '#949ca5' : '#888888'} />
        </div>
        <div className="year">
          <label htmlFor="year" className="select">
            <select name="year" id="year" value={selectYear} onChange={handleSelectYear}>
              {yearsArray.map((year, index) => (
                <option key={`year-${index}`} value={year.value}>
                  {year.name}
                </option>
              ))}
            </select>
            <Down1 width="10" height="10" color={theme.color.gray900} />
          </label>
        </div>
        <div className="month">
          <label htmlFor="month" className="select">
            <select name="month" id="month" value={selectMonth} onChange={handleSelectMonth}>
              {monthsArray.map((month, index) => (
                <option key={`month-${index}`} value={month.value}>
                  {month.name}
                </option>
              ))}
            </select>
            <Down1 width="10" height="10" color={theme.color.gray900} />
          </label>
        </div>
        <div className={classNames('next')} onClick={handleNextDate}>
          <Next width="20" height="20" color="#888888" />
        </div>
      </div>
      <div className="cal-body">
        <ul>
          <li className="day">
            <span className="sunday">일</span>
            <span>월</span>
            <span>화</span>
            <span>수</span>
            <span>목</span>
            <span>금</span>
            <span className="saturday">토</span>
          </li>
          {dayList.map((week, index) => (
            <li key={index}>
              {week.map((day, index) => {
                if (format(selectDate, 'MM') !== format(day, 'MM')) {
                  return <span key={index} />;
                }
                return (
                  <span
                    className={classNames({
                      disabled:
                        (type !== 'search' && format(new Date(), 'yyyyMMdd') > format(day, 'yyyyMMdd')) ||
                        (startDate ? format(startDate, 'yyyyMMdd') > format(day, 'yyyyMMdd') : false) ||
                        (endDate ? format(endDate, 'yyyyMMdd') < format(day, 'yyyyMMdd') : false),
                      date: format(selectDate, 'MM') === format(day, 'MM'),
                      selected: activeSelectDate ? format(activeSelectDate, 'yyyyMMdd') === format(day, 'yyyyMMdd') : false,
                      sunday: index === 0,
                      saturday: index === 6,
                    })}
                    key={index}
                    onClick={() =>
                      onSelectDate(
                        day,
                        (type !== 'search' && format(new Date(), 'yyyyMMdd') > format(day, 'yyyyMMdd')) ||
                          (startDate ? format(startDate, 'yyyyMMdd') > format(day, 'yyyyMMdd') : false) ||
                          (endDate ? format(endDate, 'yyyyMMdd') < format(day, 'yyyyMMdd') : false),
                      )
                    }
                  >
                    {Number(format(day, 'dd'))}
                  </span>
                );
              })}
            </li>
          ))}
        </ul>
      </div>
    </Container>
  );
};

export default Calendar;
