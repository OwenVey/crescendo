import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Home() {
  return (
    <main className="p-24">
      <ThemeToggle />
      <div>Normal</div>
      <div className="italic">Italic</div>
      <Input type="file" className="w-72" />
      <Button className="w-72">Button</Button>
    </main>
  );
}
