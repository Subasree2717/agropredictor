import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you within 24 hours.",
      });
      
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to send message",
        description: "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Get in Touch
            </CardTitle>
            <CardDescription>
              Have questions or feedback? We'd love to hear from you!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Your full name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  type="text"
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  placeholder="What is your message about?"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="Your message here..."
                  rows={5}
                  required
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  'Sending...'
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>
              Reach out to us through any of these channels
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-primary mt-1" />
              <div>
                <h3 className="font-semibold">Email</h3>
                <p className="text-muted-foreground">www.bighaat.com</p>
                <p className="text-muted-foreground">farmer.gov.in</p>
                <p className="text-muted-foreground">https://www.tnagrisnet.tn.gov.in</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-primary mt-1" />
              <div>
                <h3 className="font-semibold">Phone</h3>
                <p className="text-muted-foreground"> toll free Telephone No. 1551 or 1800-180-1551</p>
                <p className="text-muted-foreground">1800-180-1551</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary mt-1" />
              <div>
                <h3 className="font-semibold">Address</h3>
                <p className="text-muted-foreground">
                  1, Wallaja Road, PWD Estate, Chepauk, Chennai, Tamil Nadu 600005.
                </p>
              </div>
            </div>

            
          </CardContent>
        </Card>
      </div>
    </div>
  );
}