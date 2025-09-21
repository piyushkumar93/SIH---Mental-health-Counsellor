import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import axios from 'axios'
import { useState } from 'react'

export default function Login () {
  const { register, handleSubmit } = useForm()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  const onSubmit = async (data: any) => {
    setError('')
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', data)
      // Save user and token to localStorage
      localStorage.setItem('user', JSON.stringify(res.data.user))
      localStorage.setItem('token', res.data.token)
      alert('Login successful!')
      if (res.data.user.role === 'admin') {
        navigate('/appointments')
      } else {
        navigate('/forum')
      }
    } catch (err: any) {
      console.error('Login error', err)
      const status = err.response?.status
      const msg =
        err.response?.data?.message || err.message || 'Invalid credentials'
      setError(status ? `${status}: ${msg}` : msg)
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-background'>
      <div className='bg-card p-8 rounded-2xl shadow-card w-full max-w-md'>
        <h2 className='text-2xl font-bold mb-6 text-foreground text-center'>
          Welcome Back
        </h2>

        {error && (
          <p className='text-red-500 text-sm mb-3 text-center'>{error}</p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
          <Input
            type='email'
            placeholder='Email'
            {...register('email', { required: true })}
            className='w-full'
          />
          <Input
            type='password'
            placeholder='Password'
            {...register('password', { required: true })}
            className='w-full'
          />

          <Button type='submit' className='w-full'>
            Log In
          </Button>
        </form>

        <p className='text-center text-sm text-muted-foreground mt-4'>
          Don’t have an account?{' '}
          <span
            onClick={() => navigate('/signup')}
            className='text-primary cursor-pointer'
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  )
}
