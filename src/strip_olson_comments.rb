#!/usr/bin/ruby
 #
 # Copyright 2009 Matthew Eernisse (mde@fleegix.org)
 #
 # Licensed under the Apache License, Version 2.0 (the "License");
 # you may not use this file except in compliance with the License.
 # You may obtain a copy of the License at
 #
 #   http://www.apache.org/licenses/LICENSE-2.0
 #
 # Unless required by applicable law or agreed to in writing, software
 # distributed under the License is distributed on an "AS IS" BASIS,
 # WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 # See the License for the specific language governing permissions and
 # limitations under the License.
 #
 # This is a sample script for stripping the copious comments
 # from Olson timezone data files.
 #
def clean_file(file_path, target_path=false)
  t = File.read(file_path)
  t.gsub!(/^#.*\n/, '')
  t.gsub!(/^\n/, '')
  if target_path
    File.open(target_path, 'w') do |targ|
      targ.puts t
    end
  else
    print t
  end
end


if ARGV.length == 0
  print "Usage: strip_comments.rb /path/to/input/file\n"
  print "- puts results into standard output (console) \n"
  print "Use strip_comments.rb /path/to/input/file | /path/to/input/result_file to fill other file \n\n"
  print "Convert all tz files in folder: strip_comments.rb /path/to/folder\n"
  print "- will get all files in folder without extension and creates \"input_file_name.tz\" files filled clean content "
  print "in same folder\n "
  exit
else
  path = ARGV[0]
end

if File::directory?(path)
  Dir.foreach(path) do |entry|
    unless entry =~ /\./
      fn = File::join(path, entry)
      clean_file(fn, "#{fn}.tz")
    end
  end
else
  clean_file(path)
end

