import { useState } from 'react';
import { Globe, Check, Search, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLanguage, languages } from '@/contexts/LanguageContext';

export const LanguageSelector = () => {
  const { currentLanguage, setLanguage, isTranslating, translatePage } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = useState(false);

  const filteredLanguages = languages.filter(
    lang =>
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" title="Change Language">
          {isTranslating ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <Globe className="h-5 w-5" />
              <span className="absolute -bottom-0.5 -right-0.5 text-xs">
                {currentLanguage.flag}
              </span>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 bg-card">
        <DropdownMenuLabel className="font-display flex items-center justify-between">
          <span>Select Language</span>
          {currentLanguage.code !== 'en' && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={() => translatePage()}
              disabled={isTranslating}
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Refresh
            </Button>
          )}
        </DropdownMenuLabel>
        <div className="px-2 py-1.5">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search languages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 text-sm"
            />
          </div>
        </div>
        <DropdownMenuSeparator />
        <ScrollArea className="h-64">
          {filteredLanguages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => {
                setLanguage(lang);
                setOpen(false);
                setSearchQuery('');
              }}
              className="flex items-center justify-between cursor-pointer"
              disabled={isTranslating}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{lang.flag}</span>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{lang.name}</span>
                  <span className="text-xs text-muted-foreground">{lang.nativeName}</span>
                </div>
              </div>
              {currentLanguage.code === lang.code && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </DropdownMenuItem>
          ))}
          {filteredLanguages.length === 0 && (
            <div className="py-4 text-center text-sm text-muted-foreground">
              No languages found
            </div>
          )}
        </ScrollArea>
        {isTranslating && (
          <div className="px-2 py-2 text-xs text-center text-muted-foreground border-t">
            <Loader2 className="h-3 w-3 animate-spin inline mr-1" />
            Translating page...
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
