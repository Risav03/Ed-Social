'use client'
import React, { useState } from 'react'

export const useSearchHooks = () => {

    const[searchValue, setSearchValue] = useState<string>("")

  return {setSearchValue, searchValue}
}
