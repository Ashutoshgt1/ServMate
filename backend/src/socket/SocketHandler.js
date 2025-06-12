import fs from "fs"

function setupSocket(io) {
  const services = JSON.parse(fs.readFileSync('../backend/src/data/services.json', 'utf-8'));

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    
    let selectedService = null;
    let currentQuestion = 0;
    let collectedResponses = [];

    socket.on('start_service', (serviceName) => {
      selectedService = serviceName;
      collectedResponses = [];
      currentQuestion = 0;

      const questions = services[selectedService]?.questions;
      if (questions && questions.length) {
        socket.emit('chat_message', `Welcome! Let's diagnose your ${selectedService} issue.`);
        socket.emit('chat_message', questions[currentQuestion]);
      } else {
        socket.emit('chat_message', "Sorry, this service isn't available right now.");
      }
    });

    socket.on('user_response', (message) => {
      collectedResponses.push(message.toLowerCase());

      const questions = services[selectedService]?.questions;
      currentQuestion++;

      if (currentQuestion < questions.length) {
        socket.emit('chat_message', questions[currentQuestion]);
      } else {
        const issues = services[selectedService]?.issues || [];
        let matchedIssues = [];

        for (const issue of issues) {
          const match = issue.conditions.some(cond =>
            collectedResponses.some(resp => resp.includes(cond))
          );
          if (match) matchedIssues.push(issue);
        }

        if (matchedIssues.length) {
          socket.emit('chat_message', "Here are the possible issues and pricing:");
          matchedIssues.forEach(issue => {
            socket.emit('chat_message', `${issue.issue} - ₹${issue.price}`);
          });
        } else {
          socket.emit('chat_message', "Couldn't confidently predict the issue. Please contact support.");
        }
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
}

export default setupSocket
