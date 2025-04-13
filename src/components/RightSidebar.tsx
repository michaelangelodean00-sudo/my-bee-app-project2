
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

const contactList = [
  {
    id: "user4",
    name: "Jessica Davis",
    avatarUrl: "https://i.pravatar.cc/100?img=9",
    avatarFallback: "JD",
    status: "online"
  },
  {
    id: "user5",
    name: "David Wilson",
    avatarUrl: "https://i.pravatar.cc/100?img=15",
    avatarFallback: "DW",
    status: "online"
  },
  {
    id: "user6",
    name: "Emily Clark",
    avatarUrl: "https://i.pravatar.cc/100?img=23",
    avatarFallback: "EC",
    status: "online"
  },
  {
    id: "user7",
    name: "Robert Miller",
    avatarUrl: "https://i.pravatar.cc/100?img=26",
    avatarFallback: "RM",
    status: "offline"
  },
  {
    id: "user8",
    name: "Amanda Taylor",
    avatarUrl: "https://i.pravatar.cc/100?img=32",
    avatarFallback: "AT",
    status: "offline"
  }
];

const RightSidebar = ({ className }: { className?: string }) => {
  return (
    <div className={`w-80 p-4 hidden lg:block ${className}`}>
      <div className="space-y-6">
        <div className="pt-0">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Contacts</h3>
          </div>
          
          <div className="space-y-3">
            {contactList.map((contact) => (
              <Link
                key={contact.id}
                to={`/profile/${contact.id}`}
                className="flex items-center gap-3 hover:bg-gray-100 p-2 rounded-lg transition-colors"
              >
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={contact.avatarUrl} alt={contact.name} />
                    <AvatarFallback>{contact.avatarFallback}</AvatarFallback>
                  </Avatar>
                  {contact.status === "online" && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                  )}
                </div>
                <span className="font-medium">{contact.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
