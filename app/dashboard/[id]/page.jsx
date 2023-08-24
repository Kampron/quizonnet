'use client';

import PromptCard from '@/components/PromptCard';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { notFound, redirect, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const Dashboard = (ctx) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [ids, setIds] = useState([]);
  const [qtns, setQtns] = useState([]);

  useEffect(() => {
    async function getQtnIds() {
      try {
        const response = await axios.get(
          `/api/questions/user/userQtns/${ctx.params.id}`
        );
        const qtnIds = response.data;
        setIds(qtnIds);
      } catch (error) {
        return notFound;
      }
    }
    getQtnIds();

    async function getQuestion() {
      try {
        const response = await axios.get('/api/questions'); // Send GET request using Axios

        if (response.status !== 200) {
          // Handle non-successful response here
          return notFound;
        }

        const exam = response.data; // Access response data

        setQtns(exam); // Assuming setQtns is defined elsewhere
      } catch (error) {
        // Handle error here
        console.error('An error occurred:', error);
      }
    }

    getQuestion();
  }, [ids]);

  const userQtns = qtns.filter((qtn) => ids.includes(qtn._id));

  return (
    <section className="w-full">
      <h1 className="head_text text-left">
        <span className="blue_gradient">Your Dashboard</span>
      </h1>
      <p className="desc text-left font-poppins font-semibold">
        Below are all the questions you added to your dashboard.
        <br /> Free to add more or delete unwanted questions
      </p>

      <div className="mt-10 prompt_layout">
        {userQtns.map((qtn, index) => (
          <PromptCard key={index} post={qtn} />
        ))}
      </div>
    </section>
  );
};

export default Dashboard;
