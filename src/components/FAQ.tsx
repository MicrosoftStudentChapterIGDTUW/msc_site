'use client';

import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { motion } from 'motion/react';
import './FAQ.css';

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: 'What is MSC-IGDTUW all about?',
    answer: 'MSC IGDTUW, a technical club under the wing of Microsoft Learn Student Ambassador, is a great platform for students to come together to learn about the new technologies, network with their peers, nurture their skills and foster a sense of student community.',
  },
  {
    question: 'What prompts for MSC?',
    answer: 'MSC-IGDTUW believes that the right guidance can help you achieve ultimate success. We promise to nurture you throughout your journey and you will not miss any opportunity if you are with us.',
  },
  {
    question: 'What will MSC provide?',
    answer: 'The club aims at providing the best resources and tools to learn and grow by organizing informative webinars, seminars, technical hackathons and ideathons.',
  },
  {
    question: 'What does MSC have in stock for us?',
    answer: 'MSC IGDTUW offers many special perks for all the members such as access to all the meet and sessions and access to exclusive Microsoft supported events and resources. MSC IGDTUW is the right place for students who have a passion for technology and a desire to share and learn.',
  },
  {
    question: "What's so special about MSC?",
    answer: 'Reskill in collaboration with Azure Developer Community supported by Microsoft Azure organizes some special events exclusively for MSC members wherein one gets to network with peers along with having great learning sessions at Microsoft office, Gurugram.',
  },
];

const FAQ: React.FC = () => {
  const [expanded, setExpanded] = React.useState<string | false>('panel0');

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <section className="faq-section" id="faq">
      <div className="faq-content">
        <motion.h2
          className="faq-title"
          initial={{ opacity: 0, y: -100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: false, amount: 0.2 }}
        >
          FREQUENTLY ASKED QUESTIONS
        </motion.h2>
        
        <motion.div 
          className="faq-accordion-container"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: false, amount: 0.3 }}
        >
          {faqItems.map((item, index) => (
            <Accordion
              key={index}
              expanded={expanded === `panel${index}`}
              onChange={handleChange(`panel${index}`)}
              className="faq-accordion"
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon className="expand-icon" />}
                aria-controls={`panel${index}-content`}
                id={`panel${index}-header`}
                className="faq-summary"
              >
                <Typography component="span" className="faq-question">
                  {item.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails className="faq-details">
                <Typography className="faq-answer">{item.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;

