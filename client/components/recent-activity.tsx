import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const activities = [
  {
    id: 1,
    user: {
      name: "John Doe",
      email: "john@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "JD",
    },
    action: "created a new API key",
    target: "Production API Key",
    timestamp: "2 hours ago",
  },
  {
    id: 2,
    user: {
      name: "Jane Smith",
      email: "jane@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "JS",
    },
    action: "edited translation",
    target: "EN → ES: 'Welcome to our service'",
    timestamp: "3 hours ago",
  },
  {
    id: 3,
    user: {
      name: "Alex Johnson",
      email: "alex@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "AJ",
    },
    action: "added member to organization",
    target: "Acme Corp",
    timestamp: "5 hours ago",
  },
  {
    id: 4,
    user: {
      name: "Sarah Williams",
      email: "sarah@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "SW",
    },
    action: "revoked API key",
    target: "Test API Key",
    timestamp: "1 day ago",
  },
  {
    id: 5,
    user: {
      name: "Michael Brown",
      email: "michael@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "MB",
    },
    action: "created new organization",
    target: "Tech Solutions Inc",
    timestamp: "2 days ago",
  },
]

export function RecentActivity() {
  return (
    <div className="space-y-8">
      {activities.map((activity) => (
        <div className="flex items-center" key={activity.id}>
          <Avatar className="h-9 w-9">
            <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
            <AvatarFallback>{activity.user.initials}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{activity.user.name}</p>
            <p className="text-sm text-muted-foreground">
              {activity.action} <span className="font-medium">{activity.target}</span>
            </p>
          </div>
          <div className="ml-auto text-sm text-muted-foreground">{activity.timestamp}</div>
        </div>
      ))}
    </div>
  )
}

