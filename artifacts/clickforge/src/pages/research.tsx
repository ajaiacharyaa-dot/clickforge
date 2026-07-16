import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, Crosshair, Users, Activity, BookOpen, Loader2, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface ResearchType {
  id: string;
  label: string;
  description: string;
  icon: string;
}

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, '') ?? '';

export default function ResearchForgePage() {
  const [types, setTypes] = useState<ResearchType[]>([]);
  const [selectedType, setSelectedType] = useState('general');
  const [query, setQuery] = useState('');
  const [isResearching, setIsResearching] = useState(false);
  const [results, setResults] = useState<any | null>(null);

  useEffect(() => {
    fetch(`${BASE}/api/research/types`)
      .then(res => res.json())
      .then(data => {
        if (data.types) {
          setTypes(data.types);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const handleResearch = async () => {
    if (!query.trim()) {
      toast.error('Please enter a topic to research');
      return;
    }
    
    setIsResearching(true);
    setResults(null);
    
    try {
      const res = await fetch(`${BASE}/api/research/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, type: selectedType }),
      });
      
      if (!res.ok) throw new Error('Research failed');
      const data = await res.json();
      setResults(data);
      toast.success('Research complete');
    } catch (err) {
      console.error(err);
      toast.error('Failed to conduct research.');
    } finally {
      setIsResearching(false);
    }
  };

  const renderBulletList = (items: string[], title: string, className = '') => {
    if (!items || !items.length) return null;
    return (
      <div className={`space-y-3 ${className}`}>
        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">{title}</h3>
        <ul className="space-y-2">
          {items.map((item, i) => (
            <li key={i} className="flex gap-2 text-sm items-start">
              <span className="text-primary mt-0.5">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderBadgeList = (items: string[] | any[], title: string, field = '') => {
    if (!items || !items.length) return null;
    return (
      <div className="space-y-3">
        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">{title}</h3>
        <div className="flex flex-wrap gap-2">
          {items.map((item, i) => {
            const text = typeof item === 'string' ? item : item[field] || JSON.stringify(item);
            return (
              <Badge key={i} variant="secondary" className="px-3 py-1 font-medium bg-muted text-foreground">
                {text}
              </Badge>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header & Search */}
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-viral flex items-center justify-center text-white shadow-lg mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">ResearchForge</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Deep AI research, market intelligence, and competitor analysis.
          </p>
        </div>

        <Card className="max-w-4xl mx-auto shadow-md border-primary/10 border-2 overflow-hidden">
          <CardContent className="p-2 sm:p-4 space-y-4 bg-muted/10">
            <div className="flex flex-col sm:flex-row gap-3 relative">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="What would you like to research? e.g. 'Vegan coffee market in NYC'"
                  className="w-full pl-12 h-14 text-lg rounded-xl bg-background border-muted-foreground/20 focus-visible:ring-primary/40 shadow-sm"
                  onKeyDown={(e) => e.key === 'Enter' && handleResearch()}
                />
              </div>
              <Button 
                onClick={handleResearch} 
                disabled={isResearching || !query.trim()}
                className="h-14 px-8 rounded-xl bg-gradient-viral text-white hover:opacity-90 font-bold text-lg shadow-sm"
              >
                {isResearching ? <Loader2 className="w-6 h-6 animate-spin" /> : "Analyze"}
              </Button>
            </div>

            {types.length > 0 && (
              <Tabs value={selectedType} onValueChange={setSelectedType} className="w-full">
                <TabsList className="w-full flex flex-wrap h-auto bg-transparent justify-start gap-2 p-0">
                  {types.map(t => (
                    <TabsTrigger 
                      key={t.id} 
                      value={t.id}
                      className="rounded-full border bg-background data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary shadow-sm py-2 px-4 text-sm"
                    >
                      {t.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Results Area */}
      <div className="max-w-6xl mx-auto">
        {isResearching ? (
          <div className="space-y-6">
            <div className="h-32 bg-muted/50 rounded-2xl animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-64 bg-muted/50 rounded-2xl animate-pulse" />
              <div className="h-64 bg-muted/50 rounded-2xl animate-pulse" />
              <div className="h-64 bg-muted/50 rounded-2xl animate-pulse" />
              <div className="h-64 bg-muted/50 rounded-2xl animate-pulse md:col-span-2" />
            </div>
          </div>
        ) : results ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Executive Summary */}
            {results.summary && (
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-6 sm:p-8">
                  <h3 className="font-semibold text-primary uppercase tracking-widest text-sm mb-3">Executive Summary</h3>
                  <p className="text-lg leading-relaxed">{results.summary}</p>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Dynamic rendering based on what JSON keys are present */}
              
              {results.keyFacts && (
                <Card>
                  <CardContent className="p-6">
                    {renderBulletList(results.keyFacts, 'Key Facts')}
                  </CardContent>
                </Card>
              )}

              {(results.opportunities || results.challenges) && (
                <Card>
                  <CardContent className="p-6 space-y-6">
                    {renderBulletList(results.opportunities, 'Opportunities')}
                    {results.opportunities && results.challenges && <Separator />}
                    {renderBulletList(results.challenges, 'Challenges')}
                  </CardContent>
                </Card>
              )}

              {(results.demographics || results.psychographics) && (
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-lg">Audience Profile</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {results.demographics && (
                      <div className="space-y-4">
                        <h4 className="font-medium text-muted-foreground border-b pb-2">Demographics</h4>
                        <dl className="space-y-2 text-sm">
                          {Object.entries(results.demographics).map(([k, v]) => (
                            <div key={k} className="flex justify-between">
                              <dt className="capitalize font-medium text-muted-foreground">{k.replace(/([A-Z])/g, ' $1')}</dt>
                              <dd className="font-medium text-right max-w-[60%]">{String(v)}</dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                    )}
                    {results.psychographics && (
                      <div className="space-y-4">
                        <h4 className="font-medium text-muted-foreground border-b pb-2">Psychographics</h4>
                        {renderBadgeList(results.psychographics.interests, 'Interests')}
                        {renderBadgeList(results.psychographics.values, 'Values')}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {results.primaryKeywords && (
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-lg">Keyword Opportunities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 text-muted-foreground">
                          <tr>
                            <th className="px-4 py-3 rounded-tl-lg font-medium">Keyword</th>
                            <th className="px-4 py-3 font-medium">Intent</th>
                            <th className="px-4 py-3 rounded-tr-lg font-medium text-right">Competition</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {results.primaryKeywords.map((kw: any, i: number) => (
                            <tr key={i} className="hover:bg-muted/30">
                              <td className="px-4 py-3 font-medium">{kw.keyword || kw}</td>
                              <td className="px-4 py-3 capitalize">{kw.intent || '-'}</td>
                              <td className="px-4 py-3 text-right">
                                <Badge variant={kw.competition?.toLowerCase() === 'low' ? 'default' : kw.competition?.toLowerCase() === 'high' ? 'destructive' : 'secondary'}>
                                  {kw.competition || 'Med'}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}

              {results.competitors && (
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-lg">Key Competitors</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {results.competitors.map((comp: any, i: number) => (
                      <div key={i} className="p-4 border rounded-xl space-y-3 bg-card">
                        <h4 className="font-bold text-lg">{comp.name}</h4>
                        {comp.strengths && renderBulletList(comp.strengths, 'Strengths', 'text-xs')}
                        {comp.weaknesses && renderBulletList(comp.weaknesses, 'Weaknesses', 'text-xs')}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {(results.currentTrends || results.emergingTrends) && (
                <Card className="md:col-span-2">
                  <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {renderBadgeList(results.currentTrends, 'Current Trends', 'trend')}
                    {renderBadgeList(results.emergingTrends, 'Emerging Trends', 'trend')}
                  </CardContent>
                </Card>
              )}

              {(results.insights || results.actionableSteps) && (
                <Card className="md:col-span-2">
                  <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {renderBulletList(results.insights, 'Key Insights')}
                    {renderBulletList(results.actionableSteps, 'Actionable Steps')}
                  </CardContent>
                </Card>
              )}

              {/* Recommendation Callout */}
              {results.recommendation && (
                <Card className="md:col-span-2 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/5 border-primary/20">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1">
                      <ArrowRight className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">Strategic Recommendation</h3>
                      <p className="text-foreground/90 font-medium leading-relaxed">{results.recommendation}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        ) : (
          <div className="py-24 text-center space-y-6">
            <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-muted-foreground/50" />
            </div>
            <h2 className="text-2xl font-bold text-muted-foreground">Ready to dive deep</h2>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Select a research type and enter your topic above to generate a comprehensive AI analysis.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}