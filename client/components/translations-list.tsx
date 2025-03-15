"use client";

import type React from "react";

import { useState } from "react";

// Define the Translation interface for strong typing
interface Translation {
  id: string;
  sourceLanguage: string;
  targetLanguage: string;
  input: string;
  output: string;
  apiKey: string;
  lastUsed: string;
  hitCount: number;
}
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Mock data for translations
const initialTranslations = [
  {
    id: "1",
    sourceLanguage: "en",
    targetLanguage: "es",
    input: "Welcome to our service",
    output: "Bienvenido a nuestro servicio",
    apiKey: "i18n_prod_a1b2c3d4e5f6g7h8i9j0",
    lastUsed: "2023-12-01",
    hitCount: 342,
  },
  {
    id: "2",
    sourceLanguage: "en",
    targetLanguage: "fr",
    input: "Thank you for your purchase",
    output: "Merci pour votre achat",
    apiKey: "i18n_prod_a1b2c3d4e5f6g7h8i9j0",
    lastUsed: "2023-11-28",
    hitCount: 215,
  },
  {
    id: "3",
    sourceLanguage: "en",
    targetLanguage: "de",
    input: "How can we help you today?",
    output: "Wie können wir Ihnen heute helfen?",
    apiKey: "i18n_dev_z9y8x7w6v5u4t3s2r1q0",
    lastUsed: "2023-11-30",
    hitCount: 178,
  },
  {
    id: "4",
    sourceLanguage: "es",
    targetLanguage: "en",
    input: "¿Dónde puedo encontrar más información?",
    output: "Where can I find more information?",
    apiKey: "i18n_test_j9i8h7g6f5e4d3c2b1a0",
    lastUsed: "2023-11-25",
    hitCount: 97,
  },
  {
    id: "5",
    sourceLanguage: "fr",
    targetLanguage: "en",
    input: "Je voudrais annuler mon abonnement",
    output: "I would like to cancel my subscription",
    apiKey: "i18n_staging_a0s9d8f7g6h5j4k3l2z1",
    lastUsed: "2023-11-20",
    hitCount: 64,
  },
];

export function TranslationsList() {
  const [translations, setTranslations] = useState<Translation[]>(initialTranslations);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentTranslation, setCurrentTranslation] = useState<Translation | null>(null);

  const deleteTranslation = (id: string) => {
    setTranslations(translations.filter((trans) => trans.id !== id));
    toast({
      title: "Translation deleted",
      description: "The translation has been removed from the cache.",
    });
  };

  const openEditDialog = (translation: Translation) => {
    setCurrentTranslation({ ...translation });
    setEditDialogOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Add null check to ensure currentTranslation exists
    if (currentTranslation) {
      setTranslations(
        translations.map((trans) =>
          trans.id === currentTranslation.id ? currentTranslation : trans
        )
      );

      toast({
        title: "Translation updated",
        description: "The translation has been updated successfully.",
      });

      setEditDialogOpen(false);
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Source</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>Original Text</TableHead>
              <TableHead>Translated Text</TableHead>
              <TableHead>API Key</TableHead>
              <TableHead>Hit Count</TableHead>
              <TableHead>Last Used</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {translations.map((translation) => (
              <TableRow key={translation.id}>
                <TableCell className="font-medium uppercase">
                  {translation.sourceLanguage}
                </TableCell>
                <TableCell className="font-medium uppercase">
                  {translation.targetLanguage}
                </TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {translation.input}
                </TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {translation.output}
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {translation.apiKey.substring(0, 10)}...
                </TableCell>
                <TableCell>{translation.hitCount}</TableCell>
                <TableCell>{translation.lastUsed}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(translation)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteTranslation(translation.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {currentTranslation && (
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="sm:max-w-[550px]">
            <form onSubmit={handleEditSubmit}>
              <DialogHeader>
                <DialogTitle>Edit Translation</DialogTitle>
                <DialogDescription>
                  Edit the translation pair in the cache.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sourceLanguage">Source Language</Label>
                    <Input
                      id="sourceLanguage"
                      value={currentTranslation.sourceLanguage}
                      onChange={(e) =>
                        setCurrentTranslation({
                          ...currentTranslation,
                          sourceLanguage: e.target.value,
                        })
                      }
                      className="mt-1"
                      maxLength={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="targetLanguage">Target Language</Label>
                    <Input
                      id="targetLanguage"
                      value={currentTranslation.targetLanguage}
                      onChange={(e) =>
                        setCurrentTranslation({
                          ...currentTranslation,
                          targetLanguage: e.target.value,
                        })
                      }
                      className="mt-1"
                      maxLength={2}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="input">Original Text</Label>
                  <Textarea
                    id="input"
                    value={currentTranslation.input}
                    onChange={(e) =>
                      setCurrentTranslation({
                        ...currentTranslation,
                        input: e.target.value,
                      })
                    }
                    className="mt-1"
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="output">Translated Text</Label>
                  <Textarea
                    id="output"
                    value={currentTranslation.output}
                    onChange={(e) =>
                      setCurrentTranslation({
                        ...currentTranslation,
                        output: e.target.value,
                      })
                    }
                    className="mt-1"
                    rows={2}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
