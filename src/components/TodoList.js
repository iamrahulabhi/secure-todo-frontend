// src/components/TodoList.js
import React from 'react';
import { List } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import TodoItem from './TodoItem';

export default function TodoList({ todos, ...props }) {
  return (
    <List>
      <AnimatePresence>
        {todos.map((todo) => (
          <motion.div
            key={todo._id}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            <TodoItem todo={todo} {...props} />
          </motion.div>
        ))}
      </AnimatePresence>
    </List>
  );
}