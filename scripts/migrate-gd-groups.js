const fs = require("fs");
const mongoose = require("mongoose");

async function main() {
  const env = fs.readFileSync(".env.local", "utf8");
  const uriLine = env.split(/\r?\n/).find((line) => line.startsWith("MONGODB_URI="));

  if (!uriLine) {
    throw new Error("MONGODB_URI not found in .env.local");
  }

  const uri = uriLine.slice("MONGODB_URI=".length);
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });

  const collection = mongoose.connection.collection("gdgroups");
  const groups = await collection.find({}).toArray();

  let modifiedCount = 0;

  for (const group of groups) {
    const participants = Array.isArray(group.participants) ? group.participants : [];
    const legacyAdditionalEvaluators = Array.isArray(group.additionalEvaluators)
      ? group.additionalEvaluators
      : [];
    const legacyAdditionalIds = Array.isArray(group.additionalEvaluatorIds)
      ? group.additionalEvaluatorIds.map((id) => String(id))
      : [];

    const normalizedAdditionalIds = new Set([
      ...legacyAdditionalIds,
      ...legacyAdditionalEvaluators.map((member) => String(member.id)),
      ...participants
        .filter((member) => member && (member.isAdditionalEvaluator || legacyAdditionalIds.includes(String(member.id))))
        .map((member) => String(member.id)),
    ]);

    const coreParticipants = participants.filter(
      (member) => !member.isAdditionalEvaluator && !normalizedAdditionalIds.has(String(member.id))
    ).map((member) => ({
      ...member,
      isAdditionalEvaluator: false,
    }));

    const additionalEvaluators = [
      ...legacyAdditionalEvaluators,
      ...participants.filter(
        (member) => member.isAdditionalEvaluator || normalizedAdditionalIds.has(String(member.id))
      ),
    ]
      .filter((member, index, array) =>
        array.findIndex((item) => String(item.id) === String(member.id)) === index
      )
      .map((member) => ({
        ...member,
        isAdditionalEvaluator: true,
      }));

    const additionalEvaluatorIds = additionalEvaluators.map((member) => String(member.id));

    const needsUpdate =
      JSON.stringify(participants) !== JSON.stringify(coreParticipants) ||
      JSON.stringify(legacyAdditionalEvaluators) !== JSON.stringify(additionalEvaluators) ||
      JSON.stringify(legacyAdditionalIds) !== JSON.stringify(additionalEvaluatorIds);

    if (!needsUpdate) continue;

    await collection.updateOne(
      { _id: group._id },
      {
        $set: {
          participants: coreParticipants,
          additionalEvaluators,
          additionalEvaluatorIds,
        },
      }
    );
    modifiedCount += 1;
  }

  console.log(`Migrated ${modifiedCount} GD groups.`);
  await mongoose.disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});