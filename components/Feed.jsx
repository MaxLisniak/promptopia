"use client"
import { useState, useEffect } from 'react'
import PromptCard from './PromptCard'

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className='mt-16 prompt_layout'>
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  )
}

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return [debouncedValue, setDebouncedValue]
}

const Feed = () => {
  const [searchText, setSearchText] = useState('')
  const [debouncedSearchText, setDebouncedValue] = useDebounce(searchText, 500)
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch('/api/prompt')
      const data = await response.json()
      setPosts(data)
    }
    fetchPosts()
  }, [])

  useEffect(() => {
    const searchPosts = async () => {
      const response = await fetch(`/api/prompt?s=${debouncedSearchText}`);
      const data = await response.json();
      setPosts(data);
    };

    searchPosts();
  }, [debouncedSearchText]);

  const handleSearchChange = (e) => {
    setSearchText(e.target.value)
  }

  const handleTageClick = (tag) => {
    setDebouncedValue(tag)
    setSearchText(tag)
  }

  return (
    <section className="feed">
      <form className='relative w-full flex-center'>
        <input
          type='text'
          placeholder='Search for a tag or username'
          value={searchText}
          required
          onChange={handleSearchChange}
          className='search_input peer'
        />
      </form>

      <PromptCardList
        data={posts}
        handleTagClick={handleTageClick}
      />
    </section>
  )
}

export default Feed