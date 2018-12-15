#!/usr/bin/env perl

use strict;
use warnings;

my %word_count;

# Open the input file:
open my $input_filehandle, '<', "magna-carta.txt" or
  die "Could not open magna-carta.txt!";
my @text = <$input_filehandle>;
close $input_filehandle;

# Extract all word forms in the 'word_count' hash:
foreach my $line (@text) {
  chomp $line;
  $line =~ s/\d{1,}|\,|:|;|\.//g;
  foreach my $word (split /\s+/, $line) {
    if ($word =~ /^\w{1,}$/) {
      $word_count{$word}++;
    }
  }
}

# Output is a ready to use HTML code for a vertical scroll menu
# calling a JavaScript function to highlight clicked words:

open my $output_filehandle, '>', "magna-carta-index.txt" or
  die "Could not open magna-carta-index.txt!";

# Sort the results according to frequency,
# words with equal frequency are sorted alphabetically:
foreach my $word (reverse sort {$word_count{$a} <=> $word_count{$b} ||
                                lc($b) cmp lc($a)}
                                keys %word_count) {
  my $formatted_word_count = sprintf("%03d", $word_count{$word});
  print $output_filehandle
    "<a href=\"javascript:highlight('$word');\">$formatted_word_count&nbsp;$word</a>\n"
}

close $output_filehandle;
