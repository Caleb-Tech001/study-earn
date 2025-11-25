import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, ThumbsUp, Reply, Users, TrendingUp } from 'lucide-react';

const Community = () => {
  const discussions = [
    {
      id: '1',
      author: 'Sarah Williams',
      avatar: '',
      title: 'Tips for mastering Python decorators?',
      content: 'I\'m struggling with understanding decorators in Python. Any resources or explanations that helped you?',
      category: 'Python',
      likes: 24,
      replies: 8,
      time: '2 hours ago',
    },
    {
      id: '2',
      author: 'Michael Chen',
      avatar: '',
      title: 'Best practices for learning Data Structures',
      content: 'What approach did you find most effective when learning DSA? Looking for study tips!',
      category: 'Data Structures',
      likes: 18,
      replies: 12,
      time: '5 hours ago',
    },
    {
      id: '3',
      author: 'Emma Davis',
      avatar: '',
      title: 'Study group for Web Development?',
      content: 'Anyone interested in forming a study group for the Web Dev Fundamentals course?',
      category: 'Web Development',
      likes: 32,
      replies: 15,
      time: '1 day ago',
    },
  ];

  const trendingTopics = [
    { name: 'Python', posts: 124 },
    { name: 'Web Development', posts: 98 },
    { name: 'Data Science', posts: 76 },
    { name: 'Machine Learning', posts: 54 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-2 font-display text-4xl font-bold">Community</h1>
            <p className="text-muted-foreground">
              Connect with fellow learners and share knowledge
            </p>
          </div>
          <Button>
            <MessageSquare className="mr-2 h-4 w-4" />
            New Discussion
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Tabs defaultValue="recent" className="w-full">
              <TabsList>
                <TabsTrigger value="recent">Recent</TabsTrigger>
                <TabsTrigger value="popular">Popular</TabsTrigger>
                <TabsTrigger value="unanswered">Unanswered</TabsTrigger>
              </TabsList>
              <TabsContent value="recent" className="mt-6 space-y-4">
                {discussions.map((discussion) => (
                  <Card key={discussion.id} className="border-2 p-6 transition-smooth hover:shadow-lg">
                    <div className="mb-4 flex items-start gap-4">
                      <Avatar>
                        <AvatarImage src={discussion.avatar} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {discussion.author.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="mb-2 flex items-start justify-between">
                          <div>
                            <p className="font-semibold">{discussion.author}</p>
                            <p className="text-sm text-muted-foreground">{discussion.time}</p>
                          </div>
                          <Badge>{discussion.category}</Badge>
                        </div>
                        <h3 className="mb-2 font-display text-xl font-bold">
                          {discussion.title}
                        </h3>
                        <p className="text-muted-foreground">{discussion.content}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 border-t border-border pt-4">
                      <Button variant="ghost" size="sm">
                        <ThumbsUp className="mr-2 h-4 w-4" />
                        {discussion.likes}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Reply className="mr-2 h-4 w-4" />
                        {discussion.replies} Replies
                      </Button>
                    </div>
                  </Card>
                ))}
              </TabsContent>
              <TabsContent value="popular">
                <Card className="border-2 p-8 text-center">
                  <p className="text-muted-foreground">Popular discussions coming soon</p>
                </Card>
              </TabsContent>
              <TabsContent value="unanswered">
                <Card className="border-2 p-8 text-center">
                  <p className="text-muted-foreground">Unanswered questions coming soon</p>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card className="border-2 p-6">
              <div className="mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h3 className="font-display text-xl font-bold">Trending Topics</h3>
              </div>
              <div className="space-y-3">
                {trendingTopics.map((topic) => (
                  <div
                    key={topic.name}
                    className="flex items-center justify-between rounded-lg border border-border p-3 transition-smooth hover:bg-muted"
                  >
                    <span className="font-medium">{topic.name}</span>
                    <Badge variant="secondary">{topic.posts} posts</Badge>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="border-2 p-6">
              <div className="mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <h3 className="font-display text-xl font-bold">Community Stats</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-2xl font-bold">1,234</p>
                  <p className="text-sm text-muted-foreground">Active Members</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">456</p>
                  <p className="text-sm text-muted-foreground">Discussions</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">2,890</p>
                  <p className="text-sm text-muted-foreground">Replies</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Community;
