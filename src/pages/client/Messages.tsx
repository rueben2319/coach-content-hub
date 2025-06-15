
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send, Search, User, Clock } from 'lucide-react';

const Messages = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>('1');
  const [messageText, setMessageText] = useState('');

  // Mock conversations data
  const conversations = [
    {
      id: '1',
      coach: {
        first_name: 'Sarah',
        last_name: 'Johnson',
        avatar_url: null
      },
      last_message: 'Great progress on your React project! Let me know if you need any help.',
      last_message_at: '2024-01-19T15:30:00Z',
      unread_count: 2,
      is_online: true
    },
    {
      id: '2',
      coach: {
        first_name: 'Michael',
        last_name: 'Chen',
        avatar_url: null
      },
      last_message: 'The assignment deadline is next Friday. Don\'t forget to submit!',
      last_message_at: '2024-01-18T10:15:00Z',
      unread_count: 0,
      is_online: false
    },
    {
      id: '3',
      coach: {
        first_name: 'Emily',
        last_name: 'Rodriguez',
        avatar_url: null
      },
      last_message: 'Your portfolio design looks amazing. Small suggestions in the feedback.',
      last_message_at: '2024-01-17T14:45:00Z',
      unread_count: 1,
      is_online: true
    }
  ];

  // Mock messages for selected conversation
  const messages = [
    {
      id: '1',
      sender_type: 'coach',
      content: 'Hi! How are you progressing with the React components lesson?',
      sent_at: '2024-01-19T14:00:00Z'
    },
    {
      id: '2',
      sender_type: 'client',
      content: 'Hi Sarah! I\'m doing well. I finished the basic components and working on props now.',
      sent_at: '2024-01-19T14:15:00Z'
    },
    {
      id: '3',
      sender_type: 'coach',
      content: 'That\'s excellent! Props are fundamental. Make sure you understand how to pass data between components.',
      sent_at: '2024-01-19T14:20:00Z'
    },
    {
      id: '4',
      sender_type: 'client',
      content: 'I have a question about state management. When should I use useState vs useEffect?',
      sent_at: '2024-01-19T15:00:00Z'
    },
    {
      id: '5',
      sender_type: 'coach',
      content: 'Great question! useState is for managing component state, while useEffect is for side effects like API calls or DOM manipulation. I\'ll send you some examples.',
      sent_at: '2024-01-19T15:30:00Z'
    }
  ];

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString();
    }
  };

  const selectedConversationData = conversations.find(c => c.id === selectedConversation);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      // Here you would typically send the message to your backend
      console.log('Sending message:', messageText);
      setMessageText('');
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-600 mt-2">Chat with your coaches and instructors</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Conversations</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                placeholder="Search conversations..." 
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation.id)}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                    selectedConversation === conversation.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {conversation.coach.avatar_url ? (
                          <img 
                            src={conversation.coach.avatar_url} 
                            alt={`${conversation.coach.first_name} ${conversation.coach.last_name}`}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          getInitials(conversation.coach.first_name, conversation.coach.last_name)
                        )}
                      </div>
                      {conversation.is_online && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900 truncate">
                          {conversation.coach.first_name} {conversation.coach.last_name}
                        </h3>
                        {conversation.unread_count > 0 && (
                          <Badge className="bg-blue-600 text-white text-xs">
                            {conversation.unread_count}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate mt-1">
                        {conversation.last_message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatTime(conversation.last_message_at)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2 flex flex-col">
          {selectedConversationData ? (
            <>
              {/* Chat Header */}
              <CardHeader className="border-b">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {selectedConversationData.coach.avatar_url ? (
                        <img 
                          src={selectedConversationData.coach.avatar_url} 
                          alt={`${selectedConversationData.coach.first_name} ${selectedConversationData.coach.last_name}`}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        getInitials(selectedConversationData.coach.first_name, selectedConversationData.coach.last_name)
                      )}
                    </div>
                    {selectedConversationData.is_online && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {selectedConversationData.coach.first_name} {selectedConversationData.coach.last_name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {selectedConversationData.is_online ? 'Online now' : 'Offline'}
                    </p>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender_type === 'client' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender_type === 'client'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender_type === 'client' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {formatTime(message.sent_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>

              {/* Message Input */}
              <div className="border-t p-4">
                <div className="flex space-x-2">
                  <Input
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type your message..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} disabled={!messageText.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <CardContent className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">Select a conversation to start chatting</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Messages;
