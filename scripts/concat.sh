##  Color variables
red=`tput setaf 1`
green=`tput setaf 2`
yellow=`tput setaf 3`
violet=`tput setaf 4`
q=`tput setaf 6`
reset=`tput sgr0`
# echo "${red}red text ${green}green text${reset}"


name=$1

echo "${q}txt2mus: examples/$name${reset}"
echo "${q}txt2mus: parse files"
for entry in examples/$name/*
do
  rm -f .tmp/* && node index.js $entry
  echo "  ${violet}$entry >> $entry.waw${reset}"
done

audios=''

tracks=0

for entry in examples/$name/*.wav
do
  tracks=$((tracks+1))
  audios="$audios $entry"
done

if [ $tracks=1 ]; then
  sox $audios examples/$name.wav
else
  sox -m $audios examples/$name.wav
fi

echo "${green}examples/$name.wav created${reset}"

##  CLEANING
for entry in examples/$name/*.wav
do
  rm $entry
done

echo "${yellow}tmp files cleared${reset}"
echo "${q}txt2mus: exit...${reset}"
