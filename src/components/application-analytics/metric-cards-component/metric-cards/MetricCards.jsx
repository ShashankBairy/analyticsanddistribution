import React, { useEffect, useState } from "react";
import styles from "../metric-cards/MetricCards.module.css";
import axios from "axios";
import {useQuery} from "@tanstack/react-query"


const MetricCards = () => {

  const fetchCards=async ()=>{
    const empId=localStorage.getItem("empId");
    const response=await axios.get(`http://localhost:8080/api/dashboard/CO/cards/employee/${empId}`);
    console.log(response.data)
    return response.data ?? [];
  }


  const {data:cards, isLoading, error}=useQuery(
    {
      queryKey:["dashboardMetrics"],
      queryFn:fetchCards,
    }
  );
  if (isLoading) return <p>Loading....</p>
  if (error) return <p>error : {error.message}</p>

  return (
    <div className={styles.metric_cards_container}>
      {cards.map((card, index) => {
        const cardColor = card.percentage > 0 ? styles.card_green : styles.card_red;
        const percentageColor = card.percentage > 0 ? styles.green_text : styles.red_text;
        const percentageBorder = card.percentage > 0
          ? styles.percentage_box_border_green
          : styles.percentage_box_border_red;
        const arrowDirection = card.percentage > 0
          ? "M2.08337 4.66667L5.00004 1.75M5.00004 1.75L7.91671 4.66667M5.00004 1.75V9.25"
          : "M7.91671 6.33333L5.00004 9.25M5.00004 9.25L2.08337 6.33333M5.00004 9.25V1.75";

        return (
          <div className={`${styles.metric_card} ${cardColor}`} key={index}> 
            <div className={styles.metric_card_values}>
              <strong className={styles.card_value}>{card.value}</strong>

              
              <div className={`${styles.percentage_number_box} ${percentageBorder}`}>
                <span className={`${styles.card_percentage_text} ${percentageColor}`}>
                  {`${card.percentage >= 0 ? "+" : ""}${card.percentage}%`}
                </span>
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="10"
                    height="11"
                    viewBox="0 0 10 11"
                    fill="none"
                  >
                    <path
                      d={arrowDirection} // Dynamic path for the arrow
                      stroke={card.percentage > 0 ? "#22C55E" : "#EF4444"}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
            </div>
            <p className={styles.card_state}>{card.title}</p> {/* Use title instead of state */}
          </div>
        );
      })}
    </div>
  );
};

export default MetricCards;
