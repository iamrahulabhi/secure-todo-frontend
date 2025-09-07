import React from 'react';
import { List, Paper } from '@mui/material'; // Import Paper
import { motion, AnimatePresence } from 'framer-motion';
import TodoItem from './TodoItem';

export default function TodoList({ todos, ...props }) {
  return (
    // Wrap the entire list in a Paper component
    
      <List sx={{ padding: 0 }}> {/* Remove default list padding */}
        <AnimatePresence>
          {todos.map((todo) => (
            <motion.div
              key={todo._id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            ><Paper 
      variant="outlined" 
      sx={{ 
        borderRadius: '12px', 
        overflow: 'hidden',  
        mb: 1,  
        width: '100%',             

        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
        border: '1px solid rgba(0, 0, 0, 0.12)',
      }}
    >
              <TodoItem todo={todo} {...props} />
              </Paper>
            </motion.div>
          ))}
        </AnimatePresence>
      </List>
    
  );
}