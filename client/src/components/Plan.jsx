import React from 'react'
import { PricingTable, SignedIn, SignedOut } from '@clerk/clerk-react'

const Plan = () => {
  return (
    <div className='max-w-2xl mx-auto z-20 my-30'>
      <div className='text-center'>
        <h2 className='text-slate-800 text-[42px] font-semibold'>
          Choose Your Plan
        </h2>
        <p className='text-gray-700 max-w-lg mx-auto'>
          Start for free and scale up as you grow. Find the perfect plan for your content creation needs.
        </p>
      </div>

      <div className='mt-14 max-sm:mx-8'>
        <SignedIn>
          <PricingTable />
        </SignedIn>

        <SignedOut>
          <p className="text-center text-gray-700">
            Please sign in to view plans
          </p>
        </SignedOut>
      </div>
    </div>
  )
}

export default Plan
