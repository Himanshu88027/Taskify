'use client'

import { Checkbox } from "@/components/ui/checkbox"
import axios from 'axios'
import { useState } from 'react'

interface TaskCheckboxProps {
  todoTypeId: string;
  initialIsCompleted?: boolean;
  completeId: string;
  handler: () => void;
}

export default function TaskCheckbox({ todoTypeId, initialIsCompleted = false, completeId, handler }: TaskCheckboxProps) {
  const [isChecked, setIsChecked] = useState(initialIsCompleted)
  const [isLoading, setIsLoading] = useState(false)

  const completeTodo = async (isCompleted: boolean) => {
    setIsLoading(true)
    try {
      await axios.post(`/api/completed-todo/${todoTypeId}`, {
        isCompleted,
        progress: 100,
        completeId
      })
      handler()

    return true
    } catch (error) {
      console.error('Failed to update task status:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const handleCheckboxChange = async (checked: boolean) => {
    const newIsCompleted = checked ? checked : false
    
    const success = await completeTodo(newIsCompleted)
    
    if (success) {
      setIsChecked(newIsCompleted)
    } else {
      setIsChecked(!checked)
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <Checkbox 
        id={`task-${todoTypeId}`}
        checked={isChecked}
        onCheckedChange={handleCheckboxChange}
        disabled={isLoading}
      />
      {/* <Label htmlFor={`task-${todoTypeId}`} className={isLoading ? 'opacity-50' : ''}>
        Task {isChecked ? 'completed' : 'not completed'}
        {isLoading && ' (Updating...)'}
      </Label> */}
    </div>
  )
}