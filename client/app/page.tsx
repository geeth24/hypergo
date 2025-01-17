import ShortcutForm from "@/components/ShortcutForm"
import ShortcutList from "@/components/ShortcutList"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Home() {
  return (
    <Tabs defaultValue="create" className="space-y-8">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="create">Create Shortcut</TabsTrigger>
        <TabsTrigger value="list">View Shortcuts</TabsTrigger>
      </TabsList>
      <TabsContent value="create">
        <ShortcutForm />
      </TabsContent>
      <TabsContent value="list">
        <ShortcutList />
      </TabsContent>
    </Tabs>
  )
}

