import { useListPosts, useDeletePost } from '@workspace/api-client-react';
import { format } from 'date-fns';
import { Link } from 'wouter';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { PlatformIcon } from '@/components/ui/platform-icon';
import { PenSquare, MoreHorizontal, Trash2, Search, Filter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { toast } from 'sonner';

export default function PostsList() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { data: posts, isLoading, refetch } = useListPosts(statusFilter !== 'all' ? { status: statusFilter as any } : undefined);
  const deletePost = useDeletePost();

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      await deletePost.mutateAsync({ id });
      toast.success('Post deleted');
      refetch();
    } catch (e) {
      toast.error('Failed to delete post');
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Posts</h1>
          <p className="text-muted-foreground mt-1">Manage your scheduled and published content.</p>
        </div>
        <Button asChild className="shadow-sm">
          <Link href="/posts/new">
            <PenSquare className="w-4 h-4 mr-2" />
            New Post
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 bg-card p-4 rounded-xl shadow-sm border border-border/50">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search content..." className="pl-9 bg-muted/50 border-none" />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select 
            className="text-sm bg-transparent border-none focus:ring-0 cursor-pointer font-medium"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="sent">Sent</option>
            <option value="draft">Drafts</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      <div className="bg-card rounded-xl shadow-sm overflow-hidden border border-border/50">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[400px]">Content</TableHead>
              <TableHead>Platforms</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Scheduled Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  Loading posts...
                </TableCell>
              </TableRow>
            ) : posts?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <PenSquare className="w-8 h-8 mb-2 opacity-50" />
                    <p>No posts found.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              posts?.map((post) => (
                <TableRow key={post.id} className="group">
                  <TableCell className="align-top">
                    <div className="line-clamp-2 text-sm max-w-[400px] leading-relaxed">
                      {post.content}
                    </div>
                    {post.hashtags && post.hashtags.length > 0 && (
                      <div className="mt-2 flex gap-1 flex-wrap">
                        {post.hashtags.map(tag => (
                          <span key={tag} className="text-xs font-mono text-primary bg-primary/5 px-1.5 py-0.5 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="align-top">
                    <div className="flex -space-x-2">
                      {post.platforms.map((p) => (
                        <div key={p} className="w-8 h-8 rounded-full bg-background border-2 border-card flex items-center justify-center shadow-sm">
                          <PlatformIcon platform={p} className="w-3.5 h-3.5" />
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="align-top">
                    <StatusBadge status={post.status} />
                  </TableCell>
                  <TableCell className="align-top text-sm font-medium text-muted-foreground">
                    {format(new Date(post.scheduledAt), 'MMM d, yyyy h:mm a')}
                  </TableCell>
                  <TableCell className="align-top text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem asChild>
                          <Link href={`/posts/${post.id}`}>Edit</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive focus:bg-destructive/10"
                          onClick={() => handleDelete(post.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}