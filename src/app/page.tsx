import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export default function Home() {
  return (
    <main className="flex gap-2 p-24">
      <ThemeToggle />
      <div>Normal</div>
      <div className="italic">Italic</div>
      <Input type="file" className="w-72" />
      <Button className="w-72">Button</Button>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button>Hover Me</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Add to library</p>
        </TooltipContent>
      </Tooltip>
    </main>
  );
}
