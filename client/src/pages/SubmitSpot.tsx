import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useLocation } from "wouter";
import { PlusCircle, MapPin, AlignLeft } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useCreateSpot } from "@/hooks/use-spots";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  district: z.string().min(2, "District is required"),
  address: z.string().min(5, "Address is required"),
  description: z.string().min(10, "Description needs more detail"),
  hasWifi: z.boolean().default(false),
  hasOutlets: z.boolean().default(false),
  sundayOpen: z.boolean().default(false),
  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  tagsString: z.string().optional(),
});

const DISTRICTS = [
  "1. Innere Stadt",
  "2. Leopoldstadt",
  "3. Landstraße",
  "4. Wieden",
  "5. Margareten",
  "6. Mariahilf",
  "7. Neubau",
  "8. Josefstadt",
  "9. Alsergrund",
  "10. Favoriten",
  "11. Simmering",
  "12. Meidling",
  "13. Hietzing",
  "14. Penzing",
  "15. Rudolfsheim-Fünfhaus",
  "16. Ottakring",
  "17. Hernals",
  "18. Währing",
  "19. Döbling",
  "20. Brigittenau",
  "21. Floridsdorf",
  "22. Donaustadt",
  "23. Liesing"
];

export default function SubmitSpot() {
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const createMutation = useCreateSpot();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hasWifi: false,
      hasOutlets: false,
      sundayOpen: false,
    },
  });

  if (isLoading) return null;
  if (!isAuthenticated) {
    window.location.href = "/api/login";
    return null;
  }

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const tags = values.tagsString ? values.tagsString.split(",").map(t => t.trim()).filter(Boolean) : [];
    
    const submitData = {
      name: values.name,
      district: values.district,
      address: values.address,
      description: values.description,
      hasWifi: values.hasWifi,
      hasOutlets: values.hasOutlets,
      sundayOpen: values.sundayOpen,
      website: values.website || null,
      tags,
    };

    createMutation.mutate(submitData as any, {
      onSuccess: () => {
        toast({ title: "Spot submitted!", description: "It will be reviewed by admins shortly." });
        setLocation("/");
      },
    });
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
            <PlusCircle className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Submit a Study Spot</h1>
          <p className="text-muted-foreground mt-2">Found a great place to focus? Share it with the community.</p>
        </div>

        <div className="bg-card p-6 md:p-8 rounded-3xl shadow-xl shadow-black/5 border border-border/50">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              <div className="space-y-4">
                <h3 className="font-bold flex items-center gap-2 border-b border-border/50 pb-2">
                  <MapPin className="w-4 h-4 text-primary" /> Basic Info
                </h3>
                
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Spot Name</FormLabel>
                    <FormControl><Input placeholder="e.g. Café Sperl" className="bg-background rounded-xl" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="district" render={({ field }) => (
                    <FormItem>
                      <FormLabel>District</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-background rounded-xl">
                            <SelectValue placeholder="Select a district" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {DISTRICTS.map(d => (
                            <SelectItem key={d} value={d}>{d}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="address" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Address</FormLabel>
                      <FormControl><Input placeholder="Street name 123" className="bg-background rounded-xl" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <h3 className="font-bold flex items-center gap-2 border-b border-border/50 pb-2">
                  <AlignLeft className="w-4 h-4 text-primary" /> Details
                </h3>

                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="What's the vibe like? How's the seating?" className="bg-background rounded-xl resize-none h-24" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="tagsString" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags (comma separated)</FormLabel>
                    <FormControl><Input placeholder="quiet, good coffee, natural light" className="bg-background rounded-xl" {...field} /></FormControl>
                  </FormItem>
                )} />
                
                <FormField control={form.control} name="website" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website (optional)</FormLabel>
                    <FormControl><Input placeholder="https://..." className="bg-background rounded-xl" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="space-y-4 pt-4">
                <h3 className="font-bold border-b border-border/50 pb-2">Amenities</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormField control={form.control} name="hasWifi" render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-xl border border-border/50 p-4 bg-secondary/20">
                      <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                      <div className="space-y-1 leading-none"><FormLabel>Fast WiFi</FormLabel></div>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="hasOutlets" render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-xl border border-border/50 p-4 bg-secondary/20">
                      <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                      <div className="space-y-1 leading-none"><FormLabel>Power Outlets</FormLabel></div>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="sundayOpen" render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-xl border border-border/50 p-4 bg-secondary/20">
                      <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                      <div className="space-y-1 leading-none"><FormLabel>Open Sundays</FormLabel></div>
                    </FormItem>
                  )} />
                </div>
              </div>

              <Button type="submit" disabled={createMutation.isPending} className="w-full h-12 rounded-xl text-lg mt-8">
                {createMutation.isPending ? "Submitting..." : "Submit Spot for Review"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
