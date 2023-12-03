"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"

import Profile from "@components/Profile"

const UserProfile = () => {
  const router = useRouter()
  const [posts, setPosts] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const selectedUserEmail = useParams().email

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch(`/api/users/?email=${selectedUserEmail}`)
      const data = await response.json()
      setSelectedUser(data)
    }
    fetchUser()
  }, [selectedUserEmail])

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`/api/users/${selectedUser?._id}/posts`)
      const data = await response.json()
      setPosts(data)
    }
    if (selectedUser?._id) fetchPosts()
  }, [selectedUser])

  const handleEdit = (post) => {
    router.push(`/update-prompt?id=${post._id}`)
  }

  const handleDelete = async (post) => {
    const hasConfirmed = confirm("Are you sure you want to delete this prompt?")
    if (hasConfirmed) {
      try {
        await fetch(`/api/prompt/${post._id.toString()}`, {
          method: "DELETE",
        })
        const filteredPosts = posts.filter((p) => p._id !== post._id)
        setPosts(filteredPosts)
      } catch (error) {
        console.log(error)
      }
    }
  }

  return (
    <Profile
      name={`${selectedUser?.username}'s` || ""}
      desc={`Welcome to ${selectedUser?.username}'s profile page`}
      data={posts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  )
}

export default UserProfile