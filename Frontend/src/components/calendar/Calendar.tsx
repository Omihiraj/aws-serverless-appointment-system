import React, { useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'



type CalendarProps = {
  CallBackMethod: (date: Date) => void;
};
export function Calendar({ CallBackMethod }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  // Get current month details
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0)
  const daysInMonth = lastDayOfMonth.getDate()
  const startingDayOfWeek = firstDayOfMonth.getDay()
  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1))
    CallBackMethod(new Date(currentYear, currentMonth - 1, 1))
  }
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1))
    CallBackMethod(new Date(currentYear, currentMonth + 1, 1))
  }
  const goToToday = () => {
    setCurrentDate(new Date())
    CallBackMethod(new Date())
  }
  // Date selection
  const handleDateClick = (day: number) => {
    const newSelectedDate = new Date(currentYear, currentMonth, day)
    CallBackMethod(newSelectedDate)
    setSelectedDate(newSelectedDate)
  }
  // Generate calendar days
  const generateCalendarDays = () => {
    const calendarDays = []
    // Add empty cells for days before the first day of month
    for (let i = 0; i < startingDayOfWeek; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="h-10 w-10"></div>)
    }
    // Add cells for each day of the month
    const today = new Date()
    const isCurrentMonth =
      today.getMonth() === currentMonth && today.getFullYear() === currentYear
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day)
      const isToday = isCurrentMonth && today.getDate() === day
      const isSelected =
        selectedDate &&
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === currentMonth &&
        selectedDate.getFullYear() === currentYear
      calendarDays.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          className={`
                        h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-200
                        ${isToday ? 'ring-2 ring-[#D4AF37]' : ''}
                        ${isSelected ? 'bg-[#D4AF37] text-gray-900' : 'hover:bg-gray-800 hover:text-[#D4AF37] text-gray-300'}
                    `}
        >
          {day}
        </button>,
      )
    }
    return calendarDays
  }
  return (
    <div className="bg-gray-900 text-gray-100 rounded-lg shadow-xl p-4 border border-gray-800 w-80">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-[#D4AF37]">
          {currentDate.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
          })}
        </h2>
        <div className="flex space-x-1">
          <button
            onClick={goToPreviousMonth}
            className="p-1 rounded-full hover:bg-gray-800 text-gray-400 hover:text-[#D4AF37]"
          >
            <ChevronLeftIcon size={16} />
          </button>
          <button
            onClick={goToToday}
            className="px-2 py-1 text-xs rounded-full border border-gray-700 hover:border-[#D4AF37] hover:text-[#D4AF37]"
          >
            Today
          </button>
          <button
            onClick={goToNextMonth}
            className="p-1 rounded-full hover:bg-gray-800 text-gray-400 hover:text-[#D4AF37]"
          >
            <ChevronRightIcon size={16} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="h-10 flex items-center justify-center text-xs font-medium text-gray-500"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">{generateCalendarDays()}</div>
      {selectedDate && (
        <div className="mt-4 pt-4 border-t border-gray-800">
          <p className="text-center text-sm text-[#D4AF37]">
            Selected:{' '}
            {selectedDate.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      )}
    </div>
  )
}
