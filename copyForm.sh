if [ $# -lt 3 ]
then
	echo "Usage: copyForm <formType> <existingFormName> <newFormName>"
	echo "Where:"
	echo "   formType is the type of the form (e.g. irf or cif)"
	echo "   existingFormName is the folder name for an existing form - lower case (e.g. africa)"
	echo "   newFormName is the folder name for a new form to be based on the existing form - lower case"
	exit 3
fi
typ=$1
form=$2
toForm=$3

first=$(echo $form | cut -c1-1 | tr 'a-z' 'A-Z')
uForm=${first}$(echo $form | cut -c2-)
first=$(echo $toForm | cut -c1-1 | tr 'a-z' 'A-Z')
toUForm=${first}$(echo $toForm | cut -c2-)

if [ ! -d src/app/$typ/$form ]
then
	echo "Cannot find directory for form $form of type $typ"
	exit 1
fi

if [ -d src/app/$typ/$toForm ]
then
	echo "Diretory is already present for form $toForm of type $typ"
	exit 2
fi

mkdir src/app/$typ/$toForm
cd src/app/$typ/$form
cp -R * ../$toForm
cd ../$toForm
mv $form.component.js  $toForm.component.js
mv $form.html $toForm.html
mv $form.less $toForm.less
mv $typ.$form.route.js $typ.$toForm.route.js
mv $typ.$form.module.js $typ.$toForm.module.js

files=$(find . -type f)
for file in $files
do
	sed -e "s/$form/$toForm/g" < $file | sed -e "s/$uForm/$toUForm/g" > /tmp/form.$$
	mv /tmp/form.$$ $file

done

echo "The new form has been generated"
echo "Remember that you must edit the $typ.module.js to include the new $toForm form"
