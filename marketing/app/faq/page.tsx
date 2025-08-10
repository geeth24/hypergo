import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function FaqPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">FAQ</h1>
      <div className="mt-6">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Is HyperGo free?</AccordionTrigger>
            <AccordionContent>Yes. It is open‑source and free to self‑host.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Can I change the colors?</AccordionTrigger>
            <AccordionContent>Yes. Colors are defined via CSS variables in globals.css.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Does it require Redis?</AccordionTrigger>
            <AccordionContent>No. Redis is optional for caching. PostgreSQL is required.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}


